import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export interface ClaudeConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  system_prompt?: string;
  auto_save?: boolean;
  theme?: 'light' | 'dark' | 'system';
  editor_settings?: {
    tab_size?: number;
    word_wrap?: boolean;
    line_numbers?: boolean;
  };
}

const CONFIG_FILE_NAME = 'claude-config.json';
const CONFIG_DIR = path.join(os.homedir(), '.claude');
const CONFIG_PATH = path.join(CONFIG_DIR, CONFIG_FILE_NAME);

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ClaudeConfig = {};

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<ClaudeConfig> {
    try {
      await fs.access(CONFIG_PATH);
      const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
      this.config = JSON.parse(configData);
    } catch (error) {
      this.config = this.getDefaultConfig();
      await this.saveConfig();
    }
    return this.config;
  }

  async saveConfig(): Promise<void> {
    try {
      await fs.mkdir(CONFIG_DIR, { recursive: true });
      await fs.writeFile(CONFIG_PATH, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Failed to save config:', error);
      throw error;
    }
  }

  async updateConfig(updates: Partial<ClaudeConfig>): Promise<ClaudeConfig> {
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
    return this.config;
  }

  getConfig(): ClaudeConfig {
    return { ...this.config };
  }

  private getDefaultConfig(): ClaudeConfig {
    return {
      model: 'claude-3-sonnet-20240229',
      temperature: 0.7,
      max_tokens: 40960,
      top_p: 1,
      system_prompt: '',
      auto_save: true,
      theme: 'system',
      
      // API Settings
      api_endpoint: 'https://api.anthropic.com',
      streaming: true,
      timeout: 30000,
      max_retries: 3,
      rate_limit: {
        requests_per_minute: 60,
        tokens_per_minute: 40000,
      },
      
      // Editor Settings
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
      
      // File & Workspace Settings
      file_exclusions: ['node_modules/**', '.git/**', 'dist/**', 'build/**', '*.log'],
      workspace_settings: {
        project_specific: false,
        multi_file_context: true,
        context_window: 10000,
        include_hidden_files: false,
        follow_symlinks: false,
      },
      
      // Language Settings
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
      
      // Privacy & Security
      privacy_settings: {
        data_retention_days: 30,
        disable_telemetry: false,
        disable_analytics: false,
        local_processing_only: false,
      },
      
      // Advanced Features
      custom_tools: {
        enabled: false,
        tool_paths: [],
        permissions: [],
      },
      
      // UI Settings
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
  }
}