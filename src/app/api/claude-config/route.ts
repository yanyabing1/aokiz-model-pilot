import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CLAUDE_CONFIG_PATH = path.join(os.homedir(), '.claude', 'settings.json');

export async function GET() {
  try {
    console.log('Attempting to read Claude config from:', CLAUDE_CONFIG_PATH);
    
    // Default Claude Code settings
    const defaultConfig = {
      $schema: 'https://json.schemastore.org/claude-code-settings.json',
      env: {
        ANTHROPIC_MODEL: 'claude-3-5-sonnet-20241022',
        ANTHROPIC_BASE_URL: 'https://api.anthropic.com',
        BASH_DEFAULT_TIMEOUT_MS: '60000',
        BASH_MAX_TIMEOUT_MS: '300000',
        CLAUDE_CODE_MAX_OUTPUT_TOKENS: '4096',
        MAX_THINKING_TOKENS: '1000',
        MCP_TIMEOUT: '30000',
        MCP_TOOL_TIMEOUT: '60000',
      },
      model: 'claude-3-5-sonnet-20241022',
      permissions: {
        allow: [
          'Bash(git:*)',
          'Bash(npm:*)',
          'Bash(node:*)',
          'Read(src/**)',
          'Edit(src/**)',
          'Write(src/**)',
          'Glob',
          'Grep',
          'LS',
          'Task',
          'TodoWrite',
        ],
        deny: [],
        additionalDirectories: [],
        defaultMode: 'acceptEdits',
      },
      cleanupPeriodDays: 30,
      includeCoAuthoredBy: true,
      enableAllProjectMcpServers: false,
      enabledMcpjsonServers: ['memory', 'github'],
      disabledMcpjsonServers: [],
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 1,
      system_prompt: 'You are Claude, an AI assistant created by Anthropic.',
      ui_settings: {
        theme: 'dark',
        preferredNotifChannel: 'iterm2',
        autoUpdates: true,
        verbose: false,
      },
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

    // Check if the incoming config is in Claude Code format
    if (config.$schema || config.env) {
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
          ...config.permissions
        },
        hooks: {
          ...existingConfig.hooks,
          ...config.hooks
        },
        ui_settings: {
          ...existingConfig.ui_settings,
          ...config.ui_settings
        }
      };
      
      // Clean up undefined values
      Object.keys(mergedConfig.env || {}).forEach(key => {
        if (mergedConfig.env[key] === undefined || mergedConfig.env[key] === null || mergedConfig.env[key] === '') {
          delete mergedConfig.env[key];
        }
      });
      
      console.log('Merged Claude Code format config:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    } else {
      // Legacy format - convert to Claude Code format
      const mergedConfig = {
        ...existingConfig,
        $schema: 'https://json.schemastore.org/claude-code-settings.json',
        env: {
          ...existingConfig.env,
          ANTHROPIC_MODEL: config.model || 'claude-3-5-sonnet-20241022',
          ANTHROPIC_BASE_URL: config.api_endpoint || config.anthropic_base_url || 'https://api.anthropic.com',
          ANTHROPIC_AUTH_TOKEN: config.anthropic_auth_token,
          ANTHROPIC_API_KEY: config.anthropic_auth_token,
          BASH_DEFAULT_TIMEOUT_MS: config.timeout ? String(config.timeout) : '60000',
          CLAUDE_CODE_MAX_OUTPUT_TOKENS: config.max_tokens ? String(config.max_tokens) : '4096',
        },
        model: config.model || 'claude-3-5-sonnet-20241022',
        max_tokens: config.max_tokens || 4096,
        temperature: config.temperature || 0.7,
        top_p: config.top_p || 1,
        system_prompt: config.system_prompt || 'You are Claude, an AI assistant created by Anthropic.',
        ui_settings: {
          ...existingConfig.ui_settings,
          theme: config.theme || 'dark',
          autoUpdates: true,
          preferredNotifChannel: 'iterm2',
          verbose: false,
        },
        permissions: existingConfig.permissions || {
          allow: [
            'Bash(git:*)',
            'Bash(npm:*)',
            'Bash(node:*)',
            'Read(src/**)',
            'Edit(src/**)',
            'Write(src/**)',
            'Glob',
            'Grep',
            'LS',
            'Task',
            'TodoWrite',
          ],
          deny: [],
          additionalDirectories: [],
          defaultMode: 'acceptEdits',
        },
      };

      // Clean up undefined values
      Object.keys(mergedConfig.env).forEach(key => {
        if (mergedConfig.env[key] === undefined || mergedConfig.env[key] === null || mergedConfig.env[key] === '') {
          delete mergedConfig.env[key];
        }
      });

      console.log('Merged legacy format config:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing Claude config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}