export interface ClaudeConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  system_prompt?: string;
  auto_save?: boolean;
  theme?: 'light' | 'dark' | 'system';
  
  // API Settings
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
  
  // Editor Settings
  editor_settings?: {
    tab_size?: number;
    word_wrap?: boolean;
    line_numbers?: boolean;
    code_folding?: boolean;
    font_size?: number;
    auto_completion?: boolean;
    syntax_highlighting?: boolean;
    minimap?: boolean;
    bracket_matching?: boolean;
    auto_indent?: boolean;
  };
  
  // File & Workspace Settings
  file_exclusions?: string[];
  workspace_settings?: {
    project_specific?: boolean;
    multi_file_context?: boolean;
    context_window?: number;
    include_hidden_files?: boolean;
    follow_symlinks?: boolean;
  };
  
  // Language Settings
  language_settings?: {
    [language: string]: {
      tab_size?: number;
      formatter?: string;
      linter?: string;
      auto_completion?: boolean;
    };
  };
  
  // Privacy & Security
  privacy_settings?: {
    data_retention_days?: number;
    disable_telemetry?: boolean;
    disable_analytics?: boolean;
    local_processing_only?: boolean;
  };
  
  // Advanced Features
  custom_tools?: {
    enabled?: boolean;
    tool_paths?: string[];
    permissions?: string[];
  };
  
  // UI Settings
  ui_settings?: {
    interface_density?: 'compact' | 'comfortable' | 'spacious';
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
}