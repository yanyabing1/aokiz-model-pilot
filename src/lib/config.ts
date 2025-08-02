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
    interface_density?: 'comfortable' | 'compact' | 'spacious';
    accent_color?: string;
    font_size?: number;
    show_line_numbers?: boolean;
    show_minimap?: boolean;
    word_wrap?: boolean;
    notifications?: {
      enabled?: boolean;
      sound?: boolean;
      desktop?: boolean;
    };
  };

  // API Configuration - Quick access settings
  api_config?: {
    // Core API settings
    base_url?: string;
    auth_token?: string;
    api_key?: string;
    
    // Connection settings
    timeout?: number;
    max_retries?: number;
    streaming?: boolean;
    
    // Rate limiting
    rate_limit?: {
      requests_per_minute?: number;
      tokens_per_minute?: number;
    };
    
    // Quick configuration presets
    preset?: 'anthropic' | 'bigmodel' | 'custom';
    
    // Connection status
    connection_status?: 'connected' | 'disconnected' | 'error';
    last_tested?: string;
  };
}

// Legacy configuration interface for compatibility
export interface ClaudeConfig {
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
  
  // Environment variables
  env?: {
    ANTHROPIC_API_KEY?: string;
    ANTHROPIC_BASE_URL?: string;
    ANTHROPIC_AUTH_TOKEN?: string;
    ANTHROPIC_CUSTOM_HEADERS?: string;
    AWS_BEARER_TOKEN_BEDROCK?: string;
    ANTHROPIC_BEDROCK_BASE_URL?: string;
    ANTHROPIC_VERTEX_BASE_URL?: string;
    ANTHROPIC_VERTEX_PROJECT_ID?: string;
    ANTHROPIC_MODEL?: string;
    ANTHROPIC_SMALL_FAST_MODEL?: string;
    ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION?: string;
    CLAUDE_CODE_USE_BEDROCK?: string;
    CLAUDE_CODE_USE_VERTEX?: string;
    CLAUDE_CODE_SKIP_BEDROCK_AUTH?: string;
    CLAUDE_CODE_SKIP_VERTEX_AUTH?: string;
    CLOUD_ML_REGION?: string;
    BASH_DEFAULT_TIMEOUT_MS?: string;
    BASH_MAX_TIMEOUT_MS?: string;
    BASH_MAX_OUTPUT_LENGTH?: string;
    CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR?: string;
    CLAUDE_CODE_MAX_OUTPUT_TOKENS?: string;
    MAX_THINKING_TOKENS?: string;
    MAX_MCP_OUTPUT_TOKENS?: string;
    MCP_TIMEOUT?: string;
    MCP_TOOL_TIMEOUT?: string;
    CLAUDE_CODE_API_KEY_HELPER_TTL_MS?: string;
    CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL?: string;
    CLAUDE_CODE_DISABLE_TERMINAL_TITLE?: string;
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC?: string;
    DISABLE_AUTOUPDATER?: string;
    DISABLE_BUG_COMMAND?: string;
    DISABLE_COST_WARNINGS?: string;
    DISABLE_ERROR_REPORTING?: string;
    DISABLE_NON_ESSENTIAL_MODEL_CALLS?: string;
    DISABLE_TELEMETRY?: string;
    HTTP_PROXY?: string;
    HTTPS_PROXY?: string;
  };
  
  // Permissions
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
  
  // MCP servers
  enableAllProjectMcpServers?: boolean;
  enabledMcpjsonServers?: string[];
  disabledMcpjsonServers?: string[];
  
  // Configuration management
  cleanupPeriodDays?: number;
  includeCoAuthoredBy?: boolean;
  
  // Additional fields
  apiKeyHelper?: string;
  awsAuthRefresh?: string;
  awsCredentialExport?: string;
  forceLoginMethod?: 'claudeai' | 'console';
  
  editor_settings?: any;
  file_exclusions?: string[];
  workspace_settings?: any;
  language_settings?: any;
  privacy_settings?: any;
  custom_tools?: any;
  ui_settings?: any;
  api_config?: {
    base_url?: string;
    auth_token?: string;
    api_key?: string;
    timeout?: number;
    max_retries?: number;
    streaming?: boolean;
    rate_limit?: {
      requests_per_minute?: number;
      tokens_per_minute?: number;
    };
    preset?: 'anthropic' | 'bigmodel' | 'custom';
    connection_status?: 'connected' | 'disconnected' | 'error';
    last_tested?: string;
  };
}