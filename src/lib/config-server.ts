import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Claude Code settings format (official)
export interface ClaudeCodeSettings {
  $schema?: string;
  
  // Environment variables
  env?: {
    // Authentication
    ANTHROPIC_API_KEY?: string;
    ANTHROPIC_BASE_URL?: string;
    ANTHROPIC_AUTH_TOKEN?: string;
    ANTHROPIC_CUSTOM_HEADERS?: string;
    AWS_BEARER_TOKEN_BEDROCK?: string;
    ANTHROPIC_BEDROCK_BASE_URL?: string;
    ANTHROPIC_VERTEX_BASE_URL?: string;
    ANTHROPIC_VERTEX_PROJECT_ID?: string;
    
    // Model configuration
    ANTHROPIC_MODEL?: string;
    ANTHROPIC_SMALL_FAST_MODEL?: string;
    ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION?: string;
    
    // Cloud service configuration
    CLAUDE_CODE_USE_BEDROCK?: string;
    CLAUDE_CODE_USE_VERTEX?: string;
    CLAUDE_CODE_SKIP_BEDROCK_AUTH?: string;
    CLAUDE_CODE_SKIP_VERTEX_AUTH?: string;
    CLOUD_ML_REGION?: string;
    
    // Bash configuration
    BASH_DEFAULT_TIMEOUT_MS?: string;
    BASH_MAX_TIMEOUT_MS?: string;
    BASH_MAX_OUTPUT_LENGTH?: string;
    CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR?: string;
    
    // Output and token limits
    CLAUDE_CODE_MAX_OUTPUT_TOKENS?: string;
    MAX_THINKING_TOKENS?: string;
    MAX_MCP_OUTPUT_TOKENS?: string;
    
    // MCP configuration
    MCP_TIMEOUT?: string;
    MCP_TOOL_TIMEOUT?: string;
    
    // Debug and logging
    CLAUDE_CODE_API_KEY_HELPER_TTL_MS?: string;
    CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL?: string;
    CLAUDE_CODE_DISABLE_TERMINAL_TITLE?: string;
    
    // Disable options
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC?: string;
    DISABLE_AUTOUPDATER?: string;
    DISABLE_BUG_COMMAND?: string;
    DISABLE_COST_WARNINGS?: string;
    DISABLE_ERROR_REPORTING?: string;
    DISABLE_NON_ESSENTIAL_MODEL_CALLS?: string;
    DISABLE_TELEMETRY?: string;
    
    // Network proxy
    HTTP_PROXY?: string;
    HTTPS_PROXY?: string;
  };
  
  // Tool permissions
  permissions?: {
    allow?: string[];
    deny?: string[];
    additionalDirectories?: string[];
    defaultMode?: string;
    disableBypassPermissionsMode?: string;
  };
  
  // Hooks
  hooks?: {
    PreToolUse?: Record<string, string>;
    PostToolUse?: Record<string, string>;
    Notification?: string;
    Stop?: string;
  };
  
  // Model settings
  model?: string;
  
  // Authentication
  apiKeyHelper?: string;
  awsAuthRefresh?: string;
  awsCredentialExport?: string;
  forceLoginMethod?: 'claudeai' | 'console';
  
  // Configuration management
  cleanupPeriodDays?: number;
  includeCoAuthoredBy?: boolean;
  
  // MCP servers
  enableAllProjectMcpServers?: boolean;
  enabledMcpjsonServers?: string[];
  disabledMcpjsonServers?: string[];
  
  // Legacy compatibility - these will be flattened from claude_settings
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  system_prompt?: string;
  
  // Additional UI-specific settings
  ui_settings?: {
    theme?: 'light' | 'dark' | 'system';
    preferredNotifChannel?: 'iterm2' | 'iterm2_with_bell' | 'terminal_bell' | 'notifications_disabled';
    autoUpdates?: boolean;
    verbose?: boolean;
  };
}

// Legacy configuration interface for compatibility
export interface LegacyClaudeConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  system_prompt?: string;
  auto_save?: boolean;
  theme?: 'light' | 'dark' | 'system';
  api_endpoint?: string;
  anthropic_base_url?: string;
  anthropic_auth_token?: string;
  streaming?: boolean;
  timeout?: number;
  max_retries?: number;
  rate_limit?: {
    requests_per_minute?: number;
    tokens_per_minute?: number;
  };
  editor_settings?: any;
  file_exclusions?: string[];
  workspace_settings?: any;
  language_settings?: any;
  privacy_settings?: any;
  custom_tools?: any;
  ui_settings?: any;
}

const CONFIG_FILE_NAME = 'settings.json';
const CONFIG_DIR = path.join(os.homedir(), '.claude');
const CONFIG_PATH = path.join(CONFIG_DIR, CONFIG_FILE_NAME);

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ClaudeCodeSettings = {};

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<ClaudeCodeSettings> {
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

  async updateConfig(updates: Partial<ClaudeCodeSettings>): Promise<ClaudeCodeSettings> {
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
    return this.config;
  }

  getConfig(): ClaudeCodeSettings {
    return { ...this.config };
  }

  // Convert legacy config to Claude Code format
  static convertLegacyToClaudeCode(legacy: LegacyClaudeConfig): ClaudeCodeSettings {
    const envConfig: any = {};
    
    if (legacy.anthropic_auth_token) {
      envConfig.ANTHROPIC_AUTH_TOKEN = legacy.anthropic_auth_token;
      envConfig.ANTHROPIC_API_KEY = legacy.anthropic_auth_token;
    }
    
    if (legacy.anthropic_base_url) {
      envConfig.ANTHROPIC_BASE_URL = legacy.anthropic_base_url;
    }
    
    if (legacy.model) {
      envConfig.ANTHROPIC_MODEL = legacy.model;
    }
    
    const claudeCodeSettings: ClaudeCodeSettings = {
      $schema: 'https://json.schemastore.org/claude-code-settings.json',
      env: envConfig,
      // Flatten legacy settings to top-level for Claude Code compatibility
    };

    // Only add fields if they are defined
    if (legacy.model) {
      claudeCodeSettings.model = legacy.model;
    }
    if (legacy.max_tokens !== undefined) {
      claudeCodeSettings.max_tokens = legacy.max_tokens;
    }
    if (legacy.temperature !== undefined) {
      claudeCodeSettings.temperature = legacy.temperature;
    }
    if (legacy.top_p !== undefined) {
      claudeCodeSettings.top_p = legacy.top_p;
    }
    if (legacy.system_prompt !== undefined) {
      claudeCodeSettings.system_prompt = legacy.system_prompt;
    }

    // Only add ui_settings if theme is defined
    if (legacy.theme) {
      claudeCodeSettings.ui_settings = {
        theme: legacy.theme,
        autoUpdates: true,
        preferredNotifChannel: 'iterm2',
        verbose: false,
      };
    }

    return claudeCodeSettings;
  }

  // Convert Claude Code config to legacy format for UI compatibility
  static convertClaudeCodeToLegacy(claudeCode: ClaudeCodeSettings): LegacyClaudeConfig {
    const legacyConfig: LegacyClaudeConfig = {
      // Default values for other legacy fields
      auto_save: true,
      api_endpoint: 'https://api.anthropic.com',
      streaming: true,
      timeout: 30000,
      max_retries: 3,
      rate_limit: {
        requests_per_minute: 60,
        tokens_per_minute: 90000,
      },
    };

    // Only add fields if they are defined
    if (claudeCode.env?.ANTHROPIC_MODEL !== undefined || claudeCode.model !== undefined) {
      legacyConfig.model = claudeCode.env?.ANTHROPIC_MODEL || claudeCode.model || 'claude-3-5-sonnet-20241022';
    }
    if (claudeCode.temperature !== undefined) {
      legacyConfig.temperature = claudeCode.temperature;
    }
    if (claudeCode.max_tokens !== undefined) {
      legacyConfig.max_tokens = claudeCode.max_tokens;
    }
    if (claudeCode.top_p !== undefined) {
      legacyConfig.top_p = claudeCode.top_p;
    }
    if (claudeCode.system_prompt !== undefined) {
      legacyConfig.system_prompt = claudeCode.system_prompt;
    }
    if (claudeCode.env?.ANTHROPIC_AUTH_TOKEN !== undefined) {
      legacyConfig.anthropic_auth_token = claudeCode.env?.ANTHROPIC_AUTH_TOKEN;
    }
    if (claudeCode.env?.ANTHROPIC_BASE_URL !== undefined) {
      legacyConfig.anthropic_base_url = claudeCode.env?.ANTHROPIC_BASE_URL;
    }
    if (claudeCode.ui_settings?.theme !== undefined) {
      legacyConfig.theme = claudeCode.ui_settings?.theme;
    }

    return legacyConfig;
  }

  private getDefaultConfig(): ClaudeCodeSettings {
    return {
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
  }
}