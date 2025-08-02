import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';

const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude', 'settings.json');

export async function GET() {
  try {
    console.log('Attempting to read Claude config from:', CLAUDE_CONFIG_PATH);
    
    // Default Claude Code settings (official format)
    const defaultConfig = {
      $schema: 'https://json.schemastore.org/claude-code-settings.json',
      env: {
        ANTHROPIC_MODEL: 'claude-3-5-sonnet-20241022',
        ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
        BASH_DEFAULT_TIMEOUT_MS: '60000',
        BASH_MAX_TIMEOUT_MS: '300000',
        BASH_MAX_OUTPUT_LENGTH: '300000',
        CLAUDE_CODE_MAX_OUTPUT_TOKENS: '8192',
        MAX_THINKING_TOKENS: '8192',
        MAX_MCP_OUTPUT_TOKENS: '1000000',
        MCP_TIMEOUT: '30000',
        MCP_TOOL_TIMEOUT: '60000',
      },
      model: 'claude-3-5-sonnet-20241022',
      permissions: {
        allow: [
          'Bash(git:*)',
          'Bash(npm:*)',
          'Bash(pnpm:*)',
          'Bash(node:*)',
          'Read(src/**)',
          'Edit(src/**)',
          'Write(src/**)',
          'Glob',
          'Grep',
          'LS',
          'Task',
          'TodoWrite',
          'MultiEdit(src/**)',
          'NotebookRead',
          'NotebookEdit(*.ipynb)',
        ],
        deny: [
          'Bash(rm -rf:*)',
          'Bash(sudo:*)',
          'Edit(/etc/**)',
          'Write(/etc/**)',
        ],
        additionalDirectories: [],
        defaultMode: 'acceptEdits',
      },
      cleanupPeriodDays: 30,
      includeCoAuthoredBy: true,
      enableAllProjectMcpServers: false,
      enabledMcpjsonServers: ['memory', 'github'],
      disabledMcpjsonServers: [],
    };
    
    // Check if file exists
    try {
      await fs.access(CLAUDE_CONFIG_PATH);
      console.log('Config file exists');
      
      // Read existing config
      const configData = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
      console.log('Raw config data:', configData);
      
      const config = JSON.parse(configData);
      console.log('Parsed config:', config);
      
      // Return the full Claude Code format config
      console.log('Returning full Claude Code config:', config);
      return NextResponse.json(config);
    } catch {
      console.log('Config file does not exist, returning default config');
      // File doesn't exist, return default config
      return NextResponse.json(defaultConfig);
    }
  } catch (error) {
    console.error('Error reading Claude config:', error);
    return NextResponse.json({ error: 'Failed to read configuration' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    console.log('Received config to save:', config);
    
    // Ensure the directory exists
    const configDir = path.dirname(CLAUDE_CONFIG_PATH);
    try {
      await fs.access(configDir);
    } catch {
      await fs.mkdir(configDir, { recursive: true });
    }

    // Read existing config to preserve other settings
    let existingConfig: any = {};
    try {
      const existingData = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
      existingConfig = JSON.parse(existingData);
    } catch {
      // File doesn't exist, start with empty config
    }

    // Auto-correct CLAUDE_CODE_MAX_OUTPUT_TOKENS if it exceeds 8192
    const MAX_TOKENS_LIMIT = 8192;
    if (config.env?.CLAUDE_CODE_MAX_OUTPUT_TOKENS) {
      const tokensValue = parseInt(config.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS);
      if (tokensValue > MAX_TOKENS_LIMIT) {
        console.log(`Auto-correcting CLAUDE_CODE_MAX_OUTPUT_TOKENS from ${tokensValue} to ${MAX_TOKENS_LIMIT}`);
        config.env.CLAUDE_CODE_MAX_OUTPUT_TOKENS = String(MAX_TOKENS_LIMIT);
      }
    }

    // Check if the incoming config is in Claude Code format
    if (config.$schema || config.env || config.permissions) {
      // Direct Claude Code format - merge it properly
      const mergedConfig = {
        ...existingConfig,
        ...config,
        env: {
          ...existingConfig.env,
          ...config.env
        },
        permissions: {
          ...existingConfig.permissions,
          ...config.permissions,
          allow: config.permissions?.allow || existingConfig.permissions?.allow || [],
          deny: config.permissions?.deny || existingConfig.permissions?.deny || [],
        },
        hooks: {
          ...existingConfig.hooks,
          ...config.hooks
        }
      };
      
      // Clean up undefined values from env
      if (mergedConfig.env) {
        Object.keys(mergedConfig.env).forEach(key => {
          if (mergedConfig.env[key] === undefined || mergedConfig.env[key] === null || mergedConfig.env[key] === '') {
            delete mergedConfig.env[key];
          }
        });
      }
      
      // Remove non-Claude Code fields
      delete mergedConfig.max_tokens;
      delete mergedConfig.temperature;
      delete mergedConfig.top_p;
      delete mergedConfig.system_prompt;
      delete mergedConfig.ui_settings;
      delete mergedConfig.api_config;
      
      console.log('Merged Claude Code format config:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    } else {
      // Legacy format - convert to Claude Code format
      const MAX_TOKENS_LIMIT = 8192;
      let maxTokensValue = config.max_tokens ? parseInt(config.max_tokens) : MAX_TOKENS_LIMIT;
      
      // Auto-correct max_tokens if it exceeds limit
      if (maxTokensValue > MAX_TOKENS_LIMIT) {
        console.log(`Auto-correcting max_tokens from ${maxTokensValue} to ${MAX_TOKENS_LIMIT}`);
        maxTokensValue = MAX_TOKENS_LIMIT;
      }
      
      const mergedConfig = {
        ...existingConfig,
        $schema: 'https://json.schemastore.org/claude-code-settings.json',
        env: {
          ...existingConfig.env,
          ANTHROPIC_MODEL: config.model || 'claude-3-5-sonnet-20241022',
          ANTHROPIC_BASE_URL: config.api_endpoint || config.anthropic_base_url || 'https://api.anthropic.com',
          ANTHROPIC_AUTH_TOKEN: config.anthropic_auth_token,
          BASH_DEFAULT_TIMEOUT_MS: config.timeout ? String(config.timeout) : '60000',
          CLAUDE_CODE_MAX_OUTPUT_TOKENS: String(maxTokensValue),
        },
        model: config.model || 'claude-3-5-sonnet-20241022',
        permissions: existingConfig.permissions || {
          allow: [
            'Bash(git:*)',
            'Bash(npm:*)',
            'Bash(pnpm:*)',
            'Bash(node:*)',
            'Read(src/**)',
            'Edit(src/**)',
            'Write(src/**)',
            'Glob',
            'Grep',
            'LS',
            'Task',
            'TodoWrite',
            'MultiEdit(src/**)',
            'NotebookRead',
            'NotebookEdit(*.ipynb)',
          ],
          deny: [
            'Bash(rm -rf:*)',
            'Bash(sudo:*)',
            'Edit(/etc/**)',
            'Write(/etc/**)',
          ],
          additionalDirectories: [],
          defaultMode: 'acceptEdits',
        },
        cleanupPeriodDays: 30,
        includeCoAuthoredBy: true,
        enableAllProjectMcpServers: false,
        enabledMcpjsonServers: ['memory', 'github'],
        disabledMcpjsonServers: [],
      };

      // Clean up undefined values from env
      if (mergedConfig.env) {
        Object.keys(mergedConfig.env).forEach(key => {
          if (mergedConfig.env[key] === undefined || mergedConfig.env[key] === null || mergedConfig.env[key] === '') {
            delete mergedConfig.env[key];
          }
        });
      }

      console.log('Converted legacy to Claude Code format:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing Claude config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}