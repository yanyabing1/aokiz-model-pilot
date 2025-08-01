import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CLAUDE_CONFIG_PATH = '/Users/yytok/.claude/settings.json';

export async function GET() {
  try {
    console.log('Attempting to read Claude config from:', CLAUDE_CONFIG_PATH);
    
    // Check if file exists
    try {
      await fs.access(CLAUDE_CONFIG_PATH);
      console.log('Config file exists');
    } catch {
      console.log('Config file does not exist, returning default config');
      // File doesn't exist, return default config
      const defaultConfig = {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 40960,
        temperature: 0.7,
        top_p: 0.9,
        system_prompt: 'You are Claude, an AI assistant created by Anthropic.',
        api_endpoint: 'https://api.anthropic.com',
        streaming: true,
        timeout: 30000,
        max_retries: 3,
        rate_limit: {
          requests_per_minute: 60,
          tokens_per_minute: 40000,
        },
        auto_save: true,
        theme: 'system',
        editor_settings: {
          tab_size: 2,
          word_wrap: true,
          line_numbers: true,
          code_folding: true,
          font_size: 14,
          auto_completion: true,
          syntax_highlighting: true,
          minimap: true,
          bracket_matching: true,
          auto_indent: true,
        },
        file_exclusions: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '*.log'],
        workspace_settings: {
          project_specific: false,
          multi_file_context: true,
          context_window: 10000,
          include_hidden_files: false,
          follow_symlinks: false,
        },
        language_settings: {
          javascript: {
            tab_size: 2,
            formatter: 'prettier',
            linter: 'eslint',
            auto_completion: true,
          },
          typescript: {
            tab_size: 2,
            formatter: 'prettier',
            linter: 'eslint',
            auto_completion: true,
          },
          python: {
            tab_size: 4,
            formatter: 'black',
            linter: 'flake8',
            auto_completion: true,
          },
        },
        privacy_settings: {
          data_retention_days: 30,
          disable_telemetry: false,
          disable_analytics: false,
          local_processing_only: false,
        },
        custom_tools: {
          enabled: false,
          tool_paths: [],
          permissions: [],
        },
        ui_settings: {
          interface_density: 'comfortable',
          accent_color: '#3b82f6',
          font_size: 14,
          show_line_numbers: true,
          show_minimap: true,
          word_wrap: true,
          notifications: {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
      };
      return NextResponse.json(defaultConfig);
    }

    // Read existing config
    const configData = await fs.readFile(CLAUDE_CONFIG_PATH, 'utf-8');
    console.log('Raw config data:', configData);
    
    const config = JSON.parse(configData);
    console.log('Parsed config:', config);
    
    // Return the full Claude Code format config
    console.log('Returning full Claude Code config:', config);
    return NextResponse.json(config);
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
        }
      };
      
      // Remove claude_settings if it exists
      delete mergedConfig.claude_settings;
      
      console.log('Merged Claude Code format config:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    } else {
      // Legacy format - convert to Claude Code format
      const mergedConfig = {
        ...existingConfig,
        $schema: config.$schema || "https://json.schemastore.org/claude-code-settings.json",
        env: {
          ...existingConfig.env,
          ANTHROPIC_MODEL: config.model,
          ANTHROPIC_BASE_URL: config.api_endpoint || config.anthropic_base_url,
          ANTHROPIC_AUTH_TOKEN: config.anthropic_auth_token,
        },
        max_tokens: config.max_tokens,
        temperature: config.temperature,
        top_p: config.top_p,
        system_prompt: config.system_prompt,
        streaming: config.streaming,
        timeout: config.timeout,
        max_retries: config.max_retries,
        rate_limit: config.rate_limit,
        auto_save: config.auto_save,
        theme: config.theme,
        editor_settings: config.editor_settings,
        file_exclusions: config.file_exclusions,
        workspace_settings: config.workspace_settings,
        language_settings: config.language_settings,
        privacy_settings: config.privacy_settings,
        custom_tools: config.custom_tools,
        ui_settings: config.ui_settings,
      };

      // Remove claude_settings if it exists
      delete mergedConfig.claude_settings;

      console.log('Merged legacy format config:', mergedConfig);
      await fs.writeFile(CLAUDE_CONFIG_PATH, JSON.stringify(mergedConfig, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing Claude config:', error);
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 });
  }
}