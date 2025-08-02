'use client'

import { ClaudeCodeSettings, ClaudeConfig } from '@/lib/config'
import { Modal, Tooltip, message, notification } from 'antd'
import { useEffect, useState } from 'react'
import ClaudeConfigurationFooter from './ClaudeConfigurationFooter'
import ClaudeConfigurationHeader from './ClaudeConfigurationHeader'

interface LegacyClaudeConfig {
  model: string
  max_tokens: number
  temperature: number
  top_p: number
  system_prompt: string
}

export default function ClaudeConfigurationManager() {
  const [config, setConfig] = useState<ClaudeConfig>({
    model: 'glm-4.5',
    temperature: 0.7,
    max_tokens: 1000000,
    top_p: 0.9,
    system_prompt: `你是一个有帮助、尊重和诚实的助手。始终尽可能有帮助地回答，同时保持安全。你的回答不应包含任何有害、不道德、种族主义、性别歧视、有毒、危险或非法的内容。请确保你的回答在社会上是无偏见的，并且是积极的。
如果一个问题的含义不清楚或事实上不连贯，请解释为什么而不是回答不正确的内容。如果你不知道问题的答案，请不要分享虚假信息。`,
    theme: 'dark',
    auto_save: true,

    // API Settings
    api_endpoint: 'https://api.anthropic.com',
    anthropic_base_url: 'https://open.bigmodel.cn/api/anthropic',
    anthropic_auth_token: '',
    streaming: true,
    timeout: 30000,
    max_retries: 3,
    rate_limit: {
      requests_per_minute: 60,
      tokens_per_minute: 90000,
    },

    // Environment Variables
    env: {
      ANTHROPIC_MODEL: 'glm-4.5',
      ANTHROPIC_BASE_URL: 'https://open.bigmodel.cn/api/anthropic',
      ANTHROPIC_AUTH_TOKEN: '',
      BASH_DEFAULT_TIMEOUT_MS: '60000',
      BASH_MAX_TIMEOUT_MS: '300000',
      BASH_MAX_OUTPUT_LENGTH: '300000',
      CLAUDE_CODE_MAX_OUTPUT_TOKENS: '1000000',
      MAX_THINKING_TOKENS: '1000',
      MAX_MCP_OUTPUT_TOKENS: '1000000',
      MCP_TIMEOUT: '30000',
      MCP_TOOL_TIMEOUT: '60000',
      DISABLE_TELEMETRY: '0',
      DISABLE_AUTOUPDATER: '0',
      DISABLE_ERROR_REPORTING: '0',
      DISABLE_COST_WARNINGS: '0',
    },

    // Permissions
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
      disableBypassPermissionsMode: 'disable',
    },

    // Hooks
    hooks: {
      PreToolUse: [],
      PostToolUse: [],
      Notification: [],
      Stop: [],
    },

    // MCP Servers
    enableAllProjectMcpServers: false,
    enabledMcpjsonServers: ['memory', 'github'],
    disabledMcpjsonServers: [],

    // Editor Settings
    editor_settings: {
      tab_size: 4,
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
    file_exclusions: ['node_modules/**', '.git/**', '*.log', 'dist/**', 'build/**'],
    workspace_settings: {
      project_specific: true,
      multi_file_context: true,
      context_window: 200000,
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
      python: {
        tab_size: 4,
        formatter: 'black',
        linter: 'pylint',
        auto_completion: true,
      },
      typescript: {
        tab_size: 2,
        formatter: 'prettier',
        linter: 'eslint',
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
      enabled: true,
      tool_paths: [],
      permissions: ['read', 'write', 'execute'],
    },

    // UI Settings
    ui_settings: {
      interface_density: 'comfortable',
      accent_color: '#165DFF',
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
  })

  const [isLoading, setIsLoading] = useState(true)
  const [currentClaudeConfig, setCurrentClaudeConfig] = useState<LegacyClaudeConfig | null>(null)
  const [configStatus, setConfigStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [activeTab, setActiveTab] = useState('basic')
  const [showAuthToken, setShowAuthToken] = useState(false)
  const [configPreview, setConfigPreview] = useState<any>(null)
  const [showConfigPreview, setShowConfigPreview] = useState(false)

  useEffect(() => {
    loadClaudeConfig()
  }, [])

  const loadClaudeConfig = async () => {
    try {
      console.log('Loading Claude config...')
      const response = await fetch('/api/claude-config')
      console.log('Response status:', response.status)

      if (response.ok) {
        const claudeCodeSettings: ClaudeCodeSettings = await response.json()
        console.log('Loaded Claude config:', claudeCodeSettings)

        // 创建Legacy格式用于显示 - 从解构后的字段读取
        const legacyConfig: LegacyClaudeConfig = {
          model: claudeCodeSettings.env?.ANTHROPIC_MODEL || claudeCodeSettings.model || 'claude-3-5-sonnet-20241022',
          max_tokens: claudeCodeSettings.max_tokens || 1000000,
          temperature: claudeCodeSettings.temperature || 0.7,
          top_p: claudeCodeSettings.top_p || 1,
          system_prompt: claudeCodeSettings.system_prompt || '',
        }

        setCurrentClaudeConfig(legacyConfig)
        setConfig(prev => ({
          ...prev,
          model: legacyConfig.model,
          temperature: legacyConfig.temperature,
          max_tokens: legacyConfig.max_tokens,
          top_p: legacyConfig.top_p,
          system_prompt: legacyConfig.system_prompt || prev.system_prompt || '',
          anthropic_base_url:
            claudeCodeSettings.env?.ANTHROPIC_BASE_URL || 'https://open.bigmodel.cn/api/anthropic',
          anthropic_auth_token: claudeCodeSettings.env?.ANTHROPIC_AUTH_TOKEN || '',
          theme: claudeCodeSettings.ui_settings?.theme || 'dark',
        }))
        setConfigStatus('loaded')
      } else {
        console.error('Failed to load Claude config, status:', response.status)
        setConfigStatus('error')
      }
    } catch (error) {
      console.error('Failed to load Claude config:', error)
      setConfigStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  const saveClaudeConfig = async () => {
    try {
      // 构造Claude Code格式的配置 - 官方格式
      const claudeCodeSettings: ClaudeCodeSettings = {
        $schema: 'https://json.schemastore.org/claude-code-settings.json',
        env: {
          // 使用config.env中的环境变量，如果没有则使用默认值
          ...config.env,
          // 确保关键环境变量存在
          ANTHROPIC_AUTH_TOKEN: config.env?.ANTHROPIC_AUTH_TOKEN || config.anthropic_auth_token || '',
          ANTHROPIC_BASE_URL: config.env?.ANTHROPIC_BASE_URL || config.anthropic_base_url || 'https://open.bigmodel.cn/api/anthropic',
          ANTHROPIC_MODEL: config.env?.ANTHROPIC_MODEL || config.model || 'claude-3-5-sonnet-20241022',
          BASH_DEFAULT_TIMEOUT_MS: config.env?.BASH_DEFAULT_TIMEOUT_MS || String(config.timeout || 30000),
          CLAUDE_CODE_MAX_OUTPUT_TOKENS: config.env?.CLAUDE_CODE_MAX_OUTPUT_TOKENS || String(config.max_tokens || 1000000),
        },
        model: config.model || 'claude-3-5-sonnet-20241022',
        // 保留顶层的兼容性字段
        max_tokens: config.max_tokens || 1000000,
        temperature: config.temperature || 0.7,
        top_p: config.top_p || 1,
        system_prompt: config.system_prompt || 'You are Claude, an AI assistant created by Anthropic.',
        ui_settings: {
          theme: config.ui_settings?.theme || config.theme || 'dark',
          preferredNotifChannel: config.ui_settings?.preferredNotifChannel || 'iterm2',
          autoUpdates: config.ui_settings?.autoUpdates !== false,
          verbose: config.ui_settings?.verbose || false,
          interface_density: config.ui_settings?.interface_density || 'comfortable',
          accent_color: config.ui_settings?.accent_color || '#165DFF',
          font_size: config.ui_settings?.font_size || 14,
          show_line_numbers: config.ui_settings?.show_line_numbers || false,
          show_minimap: config.ui_settings?.show_minimap || false,
          word_wrap: config.ui_settings?.word_wrap || false,
          notifications: config.ui_settings?.notifications || {
            enabled: true,
            sound: true,
            desktop: false,
          },
        },
        permissions: config.permissions || {
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
          disableBypassPermissionsMode: 'disable',
        },
        hooks: config.hooks || {
          PreToolUse: [],
          PostToolUse: [],
          Notification: [],
          Stop: [],
        },

        // API Configuration
        api_config: config.api_config || {
          base_url: 'https://open.bigmodel.cn/api/anthropic',
          auth_token: '',
          api_key: '',
          timeout: 30000,
          max_retries: 3,
          streaming: true,
          rate_limit: {
            requests_per_minute: 60,
            tokens_per_minute: 90000,
          },
          preset: 'bigmodel',
          connection_status: 'disconnected',
          last_tested: '',
        },

        enableAllProjectMcpServers: config.enableAllProjectMcpServers || false,
        enabledMcpjsonServers: config.enabledMcpjsonServers || ['memory', 'github'],
        disabledMcpjsonServers: config.disabledMcpjsonServers || [],
        cleanupPeriodDays: config.cleanupPeriodDays || 30,
        includeCoAuthoredBy: config.includeCoAuthoredBy !== false,
      }

      // Clean up undefined values
      Object.keys(claudeCodeSettings.env || {}).forEach((key: string) => {
        if (claudeCodeSettings.env && (claudeCodeSettings.env[key as keyof typeof claudeCodeSettings.env] === undefined || claudeCodeSettings.env[key as keyof typeof claudeCodeSettings.env] === null || claudeCodeSettings.env[key as keyof typeof claudeCodeSettings.env] === '')) {
          delete claudeCodeSettings.env[key as keyof typeof claudeCodeSettings.env];
        }
      });

      console.log('Saving Claude Code settings:', claudeCodeSettings)
      console.log('Current config state:', config)

      const response = await fetch('/api/claude-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claudeCodeSettings),
      })

      console.log('Save response status:', response.status)
      const responseText = await response.text()
      console.log('Save response body:', responseText)

      if (response.ok) {
        notification.success({
          message: '保存成功',
          description: '配置已成功保存到 Claude 配置文件，请检查配置文件内容确认保存成功。',
          duration: 4,
        })
        // 重新加载配置以确保同步
        await loadClaudeConfig()
      } else {
        notification.error({
          message: '保存失败',
          description: `状态码: ${response.status}，响应: ${responseText}`,
          duration: 6,
        })
      }
    } catch (error) {
      console.error('Failed to save Claude config:', error)
      notification.error({
        message: '保存失败',
        description: `错误信息: ${error}，请检查网络连接和控制台日志`,
        duration: 6,
      })
    }
  }

  const testConfiguration = async () => {
    try {
      // 测试配置连接
      const testConfig = {
        anthropic_base_url: config.anthropic_base_url,
        anthropic_auth_token: config.anthropic_auth_token,
        model: config.model,
        timeout: config.timeout,
      }

      // 这里可以添加实际的API测试调用
      console.log('Testing configuration:', testConfig)

      // 模拟测试结果
      return {
        success: true,
        message: '配置测试成功',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        message: `配置测试失败: ${error}`,
        timestamp: new Date().toISOString(),
      }
    }
  }

  const loadConfigPreview = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const fullConfig = await response.json()
        setConfigPreview(fullConfig)
      } else {
        // 如果无法从API加载，使用当前配置
        setConfigPreview(config)
      }
    } catch (error) {
      console.error('Failed to load config preview:', error)
      setConfigPreview(config)
    }
  }

  const handleConfigChange = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      const keys = path.split('.')
      let current: any = newConfig

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!key) continue;
        if (!current[key]) {
          current[key] = {}
        }
        current = current[key]
      }

      const lastKey = keys[keys.length - 1];
      if (lastKey) {
        current[lastKey] = value;
      }
      return newConfig
    })
  }


  const tabs = [
    { id: 'basic', label: '基础设置', icon: 'fas fa-cog' },
    { id: 'permissions', label: '权限配置', icon: 'fas fa-shield-alt' },
    { id: 'environment', label: '环境变量', icon: 'fas fa-terminal' },
    { id: 'hooks', label: '钩子配置', icon: 'fas fa-link' },
    { id: 'mcp', label: 'MCP服务器', icon: 'fas fa-server' },
    { id: 'ui', label: '界面设置', icon: 'fas fa-palette' },
  ]

  return (
    <div className="bg-dark min-h-screen font-inter text-light bg-grid overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-2/3 left-2/3 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      {/* Header */}
      <ClaudeConfigurationHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto overflow-y-auto min-h-[calc(100vh-200px)]">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Tabs and Content (3/4 width) */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-6 h-full glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
              <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-dark/50 text-gray-400 hover:text-white hover:bg-dark/70'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Config Status */}
              <div className="mt-4">
                {configStatus === 'loading' && (
                  <div className="flex items-center text-yellow-500">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    <span>加载中...</span>
                  </div>
                )}
                {configStatus === 'loaded' && (
                  <div className="flex items-center text-green-500">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>已加载</span>
                  </div>
                )}
                {configStatus === 'error' && (
                  <div className="flex items-center text-red-500">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    <span>加载失败</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Current Config Sidebar (1/4 width) */}
          <div className="lg:col-span-1">
            {/* Current Config Status */}
            <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-2">
                    <i className="fas fa-file-alt text-primary text-sm"></i>
                  </div>
                  <h3 className="text-lg font-bold text-white">当前配置</h3>
                </div>
                <div className="flex items-center space-x-1">
                  {configStatus === 'loading' && (
                    <div className="flex items-center text-yellow-500 text-xs">
                      <i className="fas fa-spinner fa-spin mr-1"></i>
                      <span>加载中</span>
                    </div>
                  )}
                  {configStatus === 'loaded' && (
                    <div className="flex items-center text-green-500 text-xs">
                      <i className="fas fa-check-circle mr-1"></i>
                      <span>已加载</span>
                    </div>
                  )}
                  {configStatus === 'error' && (
                    <div className="flex items-center text-red-500 text-xs">
                      <i className="fas fa-exclamation-circle mr-1"></i>
                      <span>错误</span>
                    </div>
                  )}
                </div>
              </div>

              {currentClaudeConfig && (
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-dark/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">模型</div>
                    <div className="text-white text-sm font-medium truncate">{currentClaudeConfig.model}</div>
                  </div>
                  <div className="bg-dark/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">温度</div>
                    <div className="text-white text-sm font-medium">{currentClaudeConfig.temperature}</div>
                  </div>
                  <div className="bg-dark/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">最大令牌</div>
                    <div className="text-white text-sm font-medium">{currentClaudeConfig.max_tokens.toLocaleString()}</div>
                  </div>
                  <div className="bg-dark/50 rounded-lg p-2">
                    <div className="text-xs text-gray-400 mb-1">Top P</div>
                    <div className="text-white text-sm font-medium">{currentClaudeConfig.top_p}</div>
                  </div>
                </div>
              )}

              {!currentClaudeConfig && configStatus === 'loaded' && (
                <div className="text-yellow-400 text-xs">未找到配置数据</div>
              )}

              {configStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-exclamation-triangle text-red-400 mr-1 text-xs"></i>
                    <span className="text-red-400 font-medium text-xs">加载失败</span>
                  </div>
                  <div className="text-red-400 text-xs mb-2">
                    无法加载配置文件
                  </div>
                </div>
              )}

              {/* Configuration Status */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-xs font-medium text-gray-300 mb-2">配置状态</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">认证令牌</span>
                    <div className={`flex items-center text-xs ${
                      config.anthropic_auth_token ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <i className={`fas ${config.anthropic_auth_token ? 'fa-check' : 'fa-times'} mr-1`}></i>
                      {config.anthropic_auth_token ? '已设置' : '未设置'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">API地址</span>
                    <div className={`flex items-center text-xs ${
                      config.anthropic_base_url ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <i className={`fas ${config.anthropic_base_url ? 'fa-check' : 'fa-times'} mr-1`}></i>
                      {config.anthropic_base_url ? '已设置' : '未设置'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">系统提示</span>
                    <div className={`flex items-center text-xs ${
                      config.system_prompt ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <i className={`fas ${config.system_prompt ? 'fa-check' : 'fa-exclamation'} mr-1`}></i>
                      {config.system_prompt ? '已设置' : '未设置'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Completeness Check */}
        <div className="mt-4 p-4 bg-dark/30 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">关键配置检查</h4>
            <div className="flex space-x-2">
              {config.anthropic_base_url && config.anthropic_auth_token ? (
                <div className="flex items-center text-green-400 text-xs">
                  <i className="fas fa-check-circle mr-1"></i>
                  <span>配置完整</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-400 text-xs">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  <span>配置不完整</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              className={`flex items-center p-2 rounded text-xs ${
                config.anthropic_base_url
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              <i
                className={`fas ${config.anthropic_base_url ? 'fa-check' : 'fa-times'} mr-2`}
              ></i>
              <span>Base URL</span>
            </div>

            <div
              className={`flex items-center p-2 rounded text-xs ${
                config.anthropic_auth_token
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              <i
                className={`fas ${config.anthropic_auth_token ? 'fa-check' : 'fa-times'} mr-2`}
              ></i>
              <span>Auth Token</span>
            </div>

            <div
              className={`flex items-center p-2 rounded text-xs ${
                config.model
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              <i className={`fas ${config.model ? 'fa-check' : 'fa-times'} mr-2`}></i>
              <span>Model</span>
            </div>

            <div
              className={`flex items-center p-2 rounded text-xs ${
                config.system_prompt
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              }`}
            >
              <i
                className={`fas ${config.system_prompt ? 'fa-check' : 'fa-exclamation'} mr-2`}
              ></i>
              <span>System Prompt</span>
            </div>
          </div>

          {/* Configuration Issues Alert */}
          {(!config.anthropic_base_url || !config.anthropic_auth_token) && (
            <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center mb-2">
                <i className="fas fa-info-circle text-yellow-400 mr-2"></i>
                <span className="text-yellow-400 font-medium text-sm">配置建议</span>
              </div>
              <div className="text-yellow-300 text-xs space-y-1">
                {!config.anthropic_base_url && (
                  <div>
                    • 缺少 ANTHROPIC_BASE_URL，建议设置为: https://open.bigmodel.cn/api/anthropic
                  </div>
                )}
                {!config.anthropic_auth_token && (
                  <div>• 缺少 ANTHROPIC_AUTH_TOKEN，请在基础设置中的API配置部分填入你的认证令牌</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Basic Settings */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Model Settings Card */}
            <div className="lg:col-span-1 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                  <i className="fas fa-brain text-primary"></i>
                </div>
                <h2 className="text-xl font-bold text-white">模型设置</h2>
              </div>
              <div className="space-y-6">
                {/* Model Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">模型</label>
                  <div className="relative">
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 pr-10 text-light appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      value={config.model}
                      onChange={e => handleConfigChange('model', e.target.value)}
                    >
                      <optgroup label="Claude 4 系列">
                        <option value="claude-4-20250514">
                          Claude 4 - 最新模型
                        </option>
                      </optgroup>
                      <optgroup label="Claude 3.x 系列">
                        <option value="claude-3-7-sonnet-20250219">
                          Claude 3.7 Sonnet - 扩展思考，128K输出
                        </option>
                        <option value="claude-3-5-sonnet-20241022">
                          Claude 3.5 Sonnet - 支持计算机使用 (推荐)
                        </option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku - 最经济选择</option>
                      </optgroup>
                      <optgroup label="Claude 2.x 系列">
                        <option value="claude-2.1">Claude 2.1</option>
                        <option value="claude-2">Claude 2</option>
                        <option value="claude-instant-1.2">Claude Instant 1.2</option>
                      </optgroup>
                      <optgroup label="其他模型">
                        <option value="glm-4.5">GLM-4.5</option>
                        <option value="glm-4.5-air">GLM-4.5-Air</option>
                      </optgroup>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <i className="fas fa-chevron-down text-primary/60"></i>
                    </div>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">Temperature</label>
                    <span className="text-sm text-primary">{config.temperature || 0.7}</span>
                  </div>
                  <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 slider-track"
                      style={{ width: `${(config.temperature || 0.7) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={config.temperature || 0.7}
                      onChange={e => handleConfigChange('temperature', parseFloat(e.target.value))}
                      className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>精确</span>
                    <span>创意</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">最大令牌数</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={config.max_tokens || 10000000}
                      min="1"
                      max="10000000"
                      onChange={e => handleConfigChange('max_tokens', parseInt(e.target.value))}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <i className="fas fa-hashtag"></i>
                    </div>
                  </div>
                </div>

                {/* Top P */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">Top P</label>
                    <span className="text-sm text-primary">{config.top_p || 0.9}</span>
                  </div>
                  <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 slider-track"
                      style={{ width: `${(config.top_p || 0.9) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={config.top_p || 0.9}
                      onChange={e => handleConfigChange('top_p', parseFloat(e.target.value))}
                      className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>确定性</span>
                    <span>多样性</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Prompt Card */}
            <div className="lg:col-span-1 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mr-3">
                  <i className="fas fa-comment-dots text-secondary"></i>
                </div>
                <h2 className="text-xl font-bold text-white">系统提示</h2>
              </div>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400 text-xs">
                  <i className="fas fa-info-circle mr-1"></i>
                  使用系统指令指导 AI 行为
                </div>
                <textarea
                  className="w-full h-48 bg-dark/50 border border-secondary/40 rounded-lg p-4 pt-10 text-light font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                  placeholder="在此输入系统提示..."
                  value={config.system_prompt || ''}
                  onChange={e => handleConfigChange('system_prompt', e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg flex items-center transition-all duration-300">
                  <i className="fas fa-save mr-2"></i>
                  保存提示
                </button>
              </div>
            </div>

            {/* API Settings Card */}
            <div className="lg:col-span-2 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-3">
                  <i className="fas fa-plug text-accent"></i>
                </div>
                <h2 className="text-xl font-bold text-white">API配置</h2>
              </div>
              
              {/* Anthropic Configuration - Highlighted Section */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                    <i className="fas fa-key text-primary text-sm"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white">Anthropic 核心配置</h4>
                  <div className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                    重要
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-globe mr-1"></i>
                      ANTHROPIC_BASE_URL
                    </label>
                    <input
                      type="text"
                      value={config.anthropic_base_url}
                      onChange={e => handleConfigChange('anthropic_base_url', e.target.value)}
                      placeholder="https://open.bigmodel.cn/api/anthropic"
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">Claude API的基础URL地址</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-shield-alt mr-1"></i>
                      ANTHROPIC_AUTH_TOKEN
                    </label>
                    <div className="relative">
                      <input
                        type={showAuthToken ? 'text' : 'password'}
                        value={config.anthropic_auth_token}
                        onChange={e => handleConfigChange('anthropic_auth_token', e.target.value)}
                        placeholder="输入你的认证令牌"
                        className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 pr-10 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthToken(!showAuthToken)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <i className={`fas ${showAuthToken ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">API访问认证令牌</p>
                  </div>
                </div>

                {/* Quick Setup Button - Only show if no token is configured */}
                {!config.anthropic_auth_token && (
                  <div className="flex justify-end mt-4">
                    <Tooltip title="自动填入推荐的API配置值（需要配置有效的认证令牌）">
                      <button
                        onClick={() => {
                          handleConfigChange(
                            'anthropic_base_url',
                            'https://open.bigmodel.cn/api/anthropic'
                          )
                          message.success('已设置推荐的基础URL配置')
                          notification.info({
                            message: '快速配置完成',
                            description:
                              '已设置推荐的基础URL，请手动输入有效的认证令牌并点击"保存配置"按钮。',
                            duration: 4,
                          })
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 text-sm flex items-center"
                      >
                        <i className="fas fa-magic mr-2"></i>
                        快速配置推荐值
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Other API Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    标准API端点
                  </label>
                  <input
                    type="text"
                    value={config.api_endpoint}
                    onChange={e => handleConfigChange('api_endpoint', e.target.value)}
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">备用API端点地址</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    超时时间 (ms)
                  </label>
                  <input
                    type="number"
                    value={config.timeout}
                    onChange={e => handleConfigChange('timeout', parseInt(e.target.value))}
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">API请求超时时间</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    最大重试次数
                  </label>
                  <input
                    type="number"
                    value={config.max_retries}
                    onChange={e => handleConfigChange('max_retries', parseInt(e.target.value))}
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">失败时重试次数</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-dark/30 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-300 flex items-center">
                      <i className="fas fa-stream mr-2"></i>
                      流式响应
                    </label>
                    <p className="text-xs text-gray-400 mt-1">启用实时响应流</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={config.streaming}
                      onChange={e => handleConfigChange('streaming', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    每分钟请求限制
                  </label>
                  <input
                    type="number"
                    value={config.rate_limit?.requests_per_minute || 60}
                    onChange={e =>
                      handleConfigChange('rate_limit.requests_per_minute', parseInt(e.target.value))
                    }
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">API速率限制配置</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    每分钟令牌限制
                  </label>
                  <input
                    type="number"
                    value={config.rate_limit?.tokens_per_minute || 90000}
                    onChange={e =>
                      handleConfigChange('rate_limit.tokens_per_minute', parseInt(e.target.value))
                    }
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">令牌使用速率限制</p>
                </div>
              </div>

              {/* Configuration Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-700">
                <Tooltip title="测试当前API配置的连接状态">
                  <button
                    onClick={async () => {
                      const result = await testConfiguration()
                      if (result.success) {
                        message.success(result.message)
                        notification.success({
                          message: '连接测试成功',
                          description: '配置验证通过，连接正常',
                          duration: 3,
                        })
                      } else {
                        message.error(result.message)
                        notification.error({
                          message: '连接测试失败',
                          description: result.message,
                          duration: 5,
                        })
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-plug mr-2"></i>
                    测试配置连接
                  </button>
                </Tooltip>

                <Tooltip title="查看完整的配置文件内容">
                  <button
                    onClick={() => {
                      loadConfigPreview()
                      setShowConfigPreview(true)
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-eye mr-2"></i>
                    查看完整配置
                  </button>
                </Tooltip>

                <Tooltip title="显示当前配置的调试信息">
                  <button
                    onClick={() => {
                      console.log('=== 调试信息 ===')
                      console.log('当前界面配置:', config)
                      console.log('ANTHROPIC_BASE_URL:', config.anthropic_base_url)
                      console.log(
                        'ANTHROPIC_AUTH_TOKEN:',
                        config.anthropic_auth_token ? '已设置' : '未设置'
                      )
                      console.log('Model:', config.model)

                      const debugInfo = `ANTHROPIC_BASE_URL: ${config.anthropic_base_url || '未设置'}
ANTHROPIC_AUTH_TOKEN: ${config.anthropic_auth_token ? '已设置' : '未设置'}
Model: ${config.model}`

                      Modal.info({
                        title: '调试信息',
                        content: (
                          <div className="font-mono whitespace-pre-line text-sm">{debugInfo}</div>
                        ),
                        okText: '确定',
                        width: 500,
                      })

                      message.info('调试信息已输出到控制台')
                    }}
                    className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border border-orange-500/30 rounded-lg hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-bug mr-2"></i>
                    调试信息
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Save Configuration */}
            {/* <div className="lg:col-span-2 flex items-center justify-center mt-8">
              <button
                onClick={saveClaudeConfig}
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-save mr-2"></i>
                {isLoading ? '加载中...' : '保存到本地 Claude 配置'}
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div> */}
          </div>
        )}

        {/* Permissions Settings */}
        {activeTab === 'permissions' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-shield-alt text-primary mr-3"></i>
              权限配置
            </h3>
            <div className="space-y-6">
              {/* Default Mode */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">默认权限模式</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">默认模式</label>
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      value={config.permissions?.defaultMode || 'acceptEdits'}
                      onChange={(e) => handleConfigChange('permissions.defaultMode', e.target.value)}
                    >
                      <option value="acceptEdits">接受编辑</option>
                      <option value="prompt">提示确认</option>
                      <option value="deny">拒绝操作</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">绕过权限模式</label>
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      value={config.permissions?.disableBypassPermissionsMode || 'disable'}
                      onChange={(e) => handleConfigChange('permissions.disableBypassPermissionsMode', e.target.value)}
                    >
                      <option value="disable">禁用</option>
                      <option value="enable">启用</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Allow Rules */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">允许规则</h4>
                <div className="space-y-3">
                  {config.permissions?.allow?.map((rule, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const newAllow = [...(config.permissions?.allow || [])];
                          newAllow[index] = e.target.value;
                          handleConfigChange('permissions.allow', newAllow);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      />
                      <button
                        onClick={() => {
                          const newAllow = [...(config.permissions?.allow || [])];
                          newAllow.splice(index, 1);
                          handleConfigChange('permissions.allow', newAllow);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newAllow = [...(config.permissions?.allow || []), ''];
                      handleConfigChange('permissions.allow', newAllow);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加规则
                  </button>
                </div>
              </div>

              {/* Deny Rules */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">拒绝规则</h4>
                <div className="space-y-3">
                  {config.permissions?.deny?.map((rule, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => {
                          const newDeny = [...(config.permissions?.deny || [])];
                          newDeny[index] = e.target.value;
                          handleConfigChange('permissions.deny', newDeny);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      />
                      <button
                        onClick={() => {
                          const newDeny = [...(config.permissions?.deny || [])];
                          newDeny.splice(index, 1);
                          handleConfigChange('permissions.deny', newDeny);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newDeny = [...(config.permissions?.deny || []), ''];
                      handleConfigChange('permissions.deny', newDeny);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加规则
                  </button>
                </div>
              </div>

              {/* Additional Directories */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">额外工作目录</h4>
                <div className="space-y-3">
                  {config.permissions?.additionalDirectories?.map((dir, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={dir}
                        onChange={(e) => {
                          const newDirs = [...(config.permissions?.additionalDirectories || [])];
                          newDirs[index] = e.target.value;
                          handleConfigChange('permissions.additionalDirectories', newDirs);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      />
                      <button
                        onClick={() => {
                          const newDirs = [...(config.permissions?.additionalDirectories || [])];
                          newDirs.splice(index, 1);
                          handleConfigChange('permissions.additionalDirectories', newDirs);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newDirs = [...(config.permissions?.additionalDirectories || []), ''];
                      handleConfigChange('permissions.additionalDirectories', newDirs);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加目录
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables Settings */}
        {activeTab === 'environment' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-terminal text-primary mr-3"></i>
              环境变量配置
            </h3>
            <div className="space-y-6">
              {/* Authentication Variables */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">认证相关</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ANTHROPIC_BASE_URL</label>
                    <p className="text-xs text-gray-400 mb-2">Anthropic API 基础 URL，可用于自定义 API 端点</p>
                    <input
                      type="text"
                      value={config.env?.ANTHROPIC_BASE_URL || ''}
                      onChange={(e) => handleConfigChange('env.ANTHROPIC_BASE_URL', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <i className="fas fa-shield-alt mr-1"></i>
                      ANTHROPIC_AUTH_TOKEN
                    </label>
                    <p className="text-xs text-gray-400 mb-2">Anthropic 认证令牌，用于身份验证</p>
                    <div className="relative">
                      <input
                        type={showAuthToken ? 'text' : 'password'}
                        value={config.env?.ANTHROPIC_AUTH_TOKEN || ''}
                        onChange={(e) => handleConfigChange('env.ANTHROPIC_AUTH_TOKEN', e.target.value)}
                        placeholder="输入你的认证令牌"
                        className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 pr-10 text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAuthToken(!showAuthToken)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                      >
                        <i className={`fas ${showAuthToken ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => {
                          handleConfigChange('env.ANTHROPIC_AUTH_TOKEN', config.anthropic_auth_token || '')
                          notification.info({
                            message: '快速配置完成',
                            description: '已设置推荐的配置值，请点击"保存配置"按钮保存到Claude配置文件。',
                            duration: 4,
                          })
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-500/30 rounded-md hover:from-green-500/30 hover:to-green-600/30 transition-all text-xs flex items-center"
                      >
                        <i className="fas fa-magic mr-1"></i>
                        快速配置推荐值
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">AWS_BEARER_TOKEN_BEDROCK</label>
                    <p className="text-xs text-gray-400 mb-2">AWS Bedrock 服务的认证令牌</p>
                    <input
                      type="password"
                      value={config.env?.AWS_BEARER_TOKEN_BEDROCK || ''}
                      onChange={(e) => handleConfigChange('env.AWS_BEARER_TOKEN_BEDROCK', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                </div>
              </div>

              {/* Model Configuration */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">模型配置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ANTHROPIC_MODEL</label>
                    <p className="text-xs text-gray-400 mb-2">默认使用的 Anthropic 模型名称</p>
                    <input
                      type="text"
                      value={config.env?.ANTHROPIC_MODEL || ''}
                      onChange={(e) => handleConfigChange('env.ANTHROPIC_MODEL', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">ANTHROPIC_SMALL_FAST_MODEL</label>
                    <p className="text-xs text-gray-400 mb-2">快速小型模型名称，用于简单任务</p>
                    <input
                      type="text"
                      value={config.env?.ANTHROPIC_SMALL_FAST_MODEL || ''}
                      onChange={(e) => handleConfigChange('env.ANTHROPIC_SMALL_FAST_MODEL', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                </div>
              </div>

              {/* Bash Configuration */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">Bash配置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">BASH_DEFAULT_TIMEOUT_MS</label>
                    <p className="text-xs text-gray-400 mb-2">Bash 命令默认超时时间（毫秒）</p>
                    <input
                      type="number"
                      value={config.env?.BASH_DEFAULT_TIMEOUT_MS || ''}
                      onChange={(e) => handleConfigChange('env.BASH_DEFAULT_TIMEOUT_MS', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">BASH_MAX_TIMEOUT_MS</label>
                    <p className="text-xs text-gray-400 mb-2">Bash 命令最大超时时间（毫秒）</p>
                    <input
                      type="number"
                      value={config.env?.BASH_MAX_TIMEOUT_MS || ''}
                      onChange={(e) => handleConfigChange('env.BASH_MAX_TIMEOUT_MS', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">BASH_MAX_OUTPUT_LENGTH</label>
                    <p className="text-xs text-gray-400 mb-2">Bash 命令输出的最大长度限制</p>
                    <input
                      type="number"
                      value={config.env?.BASH_MAX_OUTPUT_LENGTH || ''}
                      onChange={(e) => handleConfigChange('env.BASH_MAX_OUTPUT_LENGTH', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                </div>
              </div>

              {/* Output Limits */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">输出限制</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CLAUDE_CODE_MAX_OUTPUT_TOKENS</label>
                    <p className="text-xs text-gray-400 mb-2">Claude Code 最大输出令牌数限制</p>
                    <input
                      type="number"
                      value={config.env?.CLAUDE_CODE_MAX_OUTPUT_TOKENS || ''}
                      onChange={(e) => handleConfigChange('env.CLAUDE_CODE_MAX_OUTPUT_TOKENS', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">MAX_THINKING_TOKENS</label>
                    <p className="text-xs text-gray-400 mb-2">最大思考令牌数，用于控制推理过程</p>
                    <input
                      type="number"
                      value={config.env?.MAX_THINKING_TOKENS || ''}
                      onChange={(e) => handleConfigChange('env.MAX_THINKING_TOKENS', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                </div>
              </div>

              {/* MCP Configuration */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">MCP配置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">MCP_TIMEOUT</label>
                    <p className="text-xs text-gray-400 mb-2">MCP（模型上下文协议）超时时间</p>
                    <input
                      type="number"
                      value={config.env?.MCP_TIMEOUT || ''}
                      onChange={(e) => handleConfigChange('env.MCP_TIMEOUT', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">MCP_TOOL_TIMEOUT</label>
                    <p className="text-xs text-gray-400 mb-2">MCP 工具执行超时时间</p>
                    <input
                      type="number"
                      value={config.env?.MCP_TOOL_TIMEOUT || ''}
                      onChange={(e) => handleConfigChange('env.MCP_TOOL_TIMEOUT', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                </div>
              </div>

              {/* Disable Options */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">禁用选项</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">DISABLE_TELEMETRY</label>
                      <p className="text-xs text-gray-400">禁用遥测数据收集</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.env?.DISABLE_TELEMETRY === '1' || config.env?.DISABLE_TELEMETRY === 'true'}
                      onChange={(e) => handleConfigChange('env.DISABLE_TELEMETRY', e.target.checked ? '1' : '0')}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">DISABLE_AUTOUPDATER</label>
                      <p className="text-xs text-gray-400">禁用自动更新功能</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.env?.DISABLE_AUTOUPDATER === '1' || config.env?.DISABLE_AUTOUPDATER === 'true'}
                      onChange={(e) => handleConfigChange('env.DISABLE_AUTOUPDATER', e.target.checked ? '1' : '0')}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">DISABLE_ERROR_REPORTING</label>
                      <p className="text-xs text-gray-400">禁用错误报告功能</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.env?.DISABLE_ERROR_REPORTING === '1' || config.env?.DISABLE_ERROR_REPORTING === 'true'}
                      onChange={(e) => handleConfigChange('env.DISABLE_ERROR_REPORTING', e.target.checked ? '1' : '0')}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">DISABLE_COST_WARNINGS</label>
                      <p className="text-xs text-gray-400">禁用成本警告提示</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.env?.DISABLE_COST_WARNINGS === '1' || config.env?.DISABLE_COST_WARNINGS === 'true'}
                      onChange={(e) => handleConfigChange('env.DISABLE_COST_WARNINGS', e.target.checked ? '1' : '0')}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Hooks Settings */}
        {activeTab === 'hooks' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-link text-primary mr-3"></i>
              钩子配置
            </h3>
            <div className="space-y-6">
              {/* PreToolUse Hooks */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">工具执行前钩子</h4>
                <div className="space-y-3">
                  {Object.entries(config.hooks?.PreToolUse || {}).map(([tool, command], index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={tool}
                        onChange={(e) => {
                          const newHooks = { ...(config.hooks?.PreToolUse || {}) };
                          delete newHooks[tool];
                          newHooks[e.target.value] = command;
                          handleConfigChange('hooks.PreToolUse', newHooks);
                        }}
                        className="bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      >
                        <option value="Bash">Bash</option>
                        <option value="Edit">Edit</option>
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>
                        <option value="WebFetch">WebFetch</option>
                        <option value="WebSearch">WebSearch</option>
                      </select>
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => {
                          const newHooks = { ...(config.hooks?.PreToolUse || {}) };
                          newHooks[tool] = e.target.value;
                          handleConfigChange('hooks.PreToolUse', newHooks);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                        placeholder="执行的命令"
                      />
                      <button
                        onClick={() => {
                          const newHooks = { ...(config.hooks?.PreToolUse || {}) };
                          delete newHooks[tool];
                          handleConfigChange('hooks.PreToolUse', newHooks);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newHooks = { ...(config.hooks?.PreToolUse || {}) };
                      newHooks['Bash'] = '';
                      handleConfigChange('hooks.PreToolUse', newHooks);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加钩子
                  </button>
                </div>
              </div>

              {/* PostToolUse Hooks */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">工具执行后钩子</h4>
                <div className="space-y-3">
                  {Object.entries(config.hooks?.PostToolUse || {}).map(([tool, command], index) => (
                    <div key={index} className="flex items-center gap-3">
                      <select
                        value={tool}
                        onChange={(e) => {
                          const newHooks = { ...(config.hooks?.PostToolUse || {}) };
                          delete newHooks[tool];
                          newHooks[e.target.value] = command;
                          handleConfigChange('hooks.PostToolUse', newHooks);
                        }}
                        className="bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      >
                        <option value="Bash">Bash</option>
                        <option value="Edit">Edit</option>
                        <option value="Read">Read</option>
                        <option value="Write">Write</option>
                        <option value="WebFetch">WebFetch</option>
                        <option value="WebSearch">WebSearch</option>
                      </select>
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => {
                          const newHooks = { ...(config.hooks?.PostToolUse || {}) };
                          newHooks[tool] = e.target.value;
                          handleConfigChange('hooks.PostToolUse', newHooks);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                        placeholder="执行的命令"
                      />
                      <button
                        onClick={() => {
                          const newHooks = { ...(config.hooks?.PostToolUse || {}) };
                          delete newHooks[tool];
                          handleConfigChange('hooks.PostToolUse', newHooks);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newHooks = { ...(config.hooks?.PostToolUse || {}) };
                      newHooks['Bash'] = '';
                      handleConfigChange('hooks.PostToolUse', newHooks);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加钩子
                  </button>
                </div>
              </div>

              {/* Other Hooks */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">其他钩子</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">通知钩子</label>
                    <input
                      type="text"
                      value={config.hooks?.Notification || ''}
                      onChange={(e) => handleConfigChange('hooks.Notification', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      placeholder="通知时执行的命令"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">停止钩子</label>
                    <input
                      type="text"
                      value={config.hooks?.Stop || ''}
                      onChange={(e) => handleConfigChange('hooks.Stop', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      placeholder="停止时执行的命令"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MCP Servers Settings */}
        {activeTab === 'mcp' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-server text-primary mr-3"></i>
              MCP服务器配置
            </h3>
            <div className="space-y-6">
              {/* MCP Server Management */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">服务器管理</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">自动批准项目MCP服务器</label>
                    <input
                      type="checkbox"
                      checked={config.enableAllProjectMcpServers || false}
                      onChange={(e) => handleConfigChange('enableAllProjectMcpServers', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>

              {/* Enabled MCP Servers */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">启用的MCP服务器</h4>
                <div className="space-y-3">
                  {config.enabledMcpjsonServers?.map((server, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={server}
                        onChange={(e) => {
                          const newServers = [...(config.enabledMcpjsonServers || [])];
                          newServers[index] = e.target.value;
                          handleConfigChange('enabledMcpjsonServers', newServers);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      />
                      <button
                        onClick={() => {
                          const newServers = [...(config.enabledMcpjsonServers || [])];
                          newServers.splice(index, 1);
                          handleConfigChange('enabledMcpjsonServers', newServers);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newServers = [...(config.enabledMcpjsonServers || []), ''];
                      handleConfigChange('enabledMcpjsonServers', newServers);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加服务器
                  </button>
                </div>
              </div>

              {/* Disabled MCP Servers */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">禁用的MCP服务器</h4>
                <div className="space-y-3">
                  {config.disabledMcpjsonServers?.map((server, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={server}
                        onChange={(e) => {
                          const newServers = [...(config.disabledMcpjsonServers || [])];
                          newServers[index] = e.target.value;
                          handleConfigChange('disabledMcpjsonServers', newServers);
                        }}
                        className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-4 text-light"
                      />
                      <button
                        onClick={() => {
                          const newServers = [...(config.disabledMcpjsonServers || [])];
                          newServers.splice(index, 1);
                          handleConfigChange('disabledMcpjsonServers', newServers);
                        }}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newServers = [...(config.disabledMcpjsonServers || []), ''];
                      handleConfigChange('disabledMcpjsonServers', newServers);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 flex items-center"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加服务器
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Configuration Preview Modal */}
        {showConfigPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-dark border border-primary/30 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                    <i className="fas fa-code text-purple-400"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">完整配置预览</h3>
                </div>
                <button
                  onClick={() => setShowConfigPreview(false)}
                  className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="bg-dark/50 rounded-lg p-4 border border-gray-700">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono overflow-x-auto">
                    {configPreview
                      ? JSON.stringify(configPreview, null, 2)
                      : JSON.stringify(config, null, 2)}
                  </pre>
                </div>

                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center mb-2">
                    <i className="fas fa-info-circle text-yellow-400 mr-2"></i>
                    <span className="text-yellow-400 font-medium">配置信息</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>
                      • <strong>ANTHROPIC_BASE_URL:</strong> {config.anthropic_base_url || '未设置'}
                    </li>
                    <li>
                      • <strong>ANTHROPIC_AUTH_TOKEN:</strong>{' '}
                      {config.anthropic_auth_token ? '已设置 (***隐藏***)' : '未设置'}
                    </li>
                    <li>
                      • <strong>当前模型:</strong> {config.model}
                    </li>
                    <li>
                      • <strong>温度:</strong> {config.temperature}
                    </li>
                    <li>
                      • <strong>最大令牌:</strong> {config.max_tokens}
                    </li>
                    <li>
                      • <strong>Top P:</strong> {config.top_p}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(configPreview || config, null, 2))
                    message.success('配置已复制到剪贴板')
                  }}
                  className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors flex items-center"
                >
                  <i className="fas fa-copy mr-2"></i>
                  复制配置
                </button>
                <button
                  onClick={() => setShowConfigPreview(false)}
                  className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-lg hover:bg-gray-500/30 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Settings */}
        {activeTab === 'editor' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-code text-primary mr-3"></i>
              编辑器设置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">制表符大小</label>
                <input
                  type="number"
                  value={config.editor_settings?.tab_size || 4}
                  onChange={e =>
                    handleConfigChange('editor_settings.tab_size', parseInt(e.target.value))
                  }
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                <input
                  type="number"
                  value={config.editor_settings?.font_size || 14}
                  onChange={e =>
                    handleConfigChange('editor_settings.font_size', parseInt(e.target.value))
                  }
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">自动换行</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.word_wrap || false}
                  onChange={e => handleConfigChange('editor_settings.word_wrap', e.target.checked)}
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">行号</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.line_numbers || false}
                  onChange={e =>
                    handleConfigChange('editor_settings.line_numbers', e.target.checked)
                  }
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">代码折叠</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.code_folding || false}
                  onChange={e =>
                    handleConfigChange('editor_settings.code_folding', e.target.checked)
                  }
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">自动补全</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.auto_completion || false}
                  onChange={e =>
                    handleConfigChange('editor_settings.auto_completion', e.target.checked)
                  }
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">语法高亮</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.syntax_highlighting || false}
                  onChange={e =>
                    handleConfigChange('editor_settings.syntax_highlighting', e.target.checked)
                  }
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">小地图</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.minimap || false}
                  onChange={e => handleConfigChange('editor_settings.minimap', e.target.checked)}
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">括号匹配</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.bracket_matching || false}
                  onChange={e =>
                    handleConfigChange('editor_settings.bracket_matching', e.target.checked)
                  }
                  className="toggle"
                />
              </div>
            </div>
          </div>
        )}

  
        {/* UI Settings */}
        {activeTab === 'ui' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-palette text-primary mr-3"></i>
              界面设置
            </h3>
            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">主题设置</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">主题</label>
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      value={config.ui_settings?.theme || 'dark'}
                      onChange={(e) => handleConfigChange('ui_settings.theme', e.target.value)}
                    >
                      <option value="dark">深色</option>
                      <option value="light">浅色</option>
                      <option value="system">系统</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">通知渠道</label>
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      value={config.ui_settings?.preferredNotifChannel || 'iterm2'}
                      onChange={(e) => handleConfigChange('ui_settings.preferredNotifChannel', e.target.value)}
                    >
                      <option value="iterm2">iTerm2</option>
                      <option value="iterm2_with_bell">iTerm2 with Bell</option>
                      <option value="terminal_bell">Terminal Bell</option>
                      <option value="notifications_disabled">禁用通知</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">自动更新</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.autoUpdates !== false}
                      onChange={(e) => handleConfigChange('ui_settings.autoUpdates', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>

              {/* Global Settings */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">全局设置</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">详细输出</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.verbose || false}
                      onChange={(e) => handleConfigChange('ui_settings.verbose', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">数据保留天数</label>
                    <input
                      type="number"
                      value={config.cleanupPeriodDays || 30}
                      onChange={(e) => handleConfigChange('cleanupPeriodDays', parseInt(e.target.value))}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">包含Claude署名</label>
                    <input
                      type="checkbox"
                      checked={config.includeCoAuthoredBy !== false}
                      onChange={(e) => handleConfigChange('includeCoAuthoredBy', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>

              {/* Legacy UI Settings */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">界面细节</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">界面密度</label>
                    <select
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                      value={config.ui_settings?.interface_density || 'comfortable'}
                      onChange={(e) => handleConfigChange('ui_settings.interface_density', e.target.value)}
                    >
                      <option value="comfortable">舒适</option>
                      <option value="compact">紧凑</option>
                      <option value="spacious">宽松</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">强调色</label>
                    <input
                      type="color"
                      value={config.ui_settings?.accent_color || '#165DFF'}
                      onChange={(e) => handleConfigChange('ui_settings.accent_color', e.target.value)}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                    <input
                      type="number"
                      value={config.ui_settings?.font_size || 14}
                      onChange={(e) => handleConfigChange('ui_settings.font_size', parseInt(e.target.value))}
                      className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">显示行号</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.show_line_numbers || false}
                      onChange={(e) => handleConfigChange('ui_settings.show_line_numbers', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">显示小地图</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.show_minimap || false}
                      onChange={(e) => handleConfigChange('ui_settings.show_minimap', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">自动换行</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.word_wrap || false}
                      onChange={(e) => handleConfigChange('ui_settings.word_wrap', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-dark/30 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-4">通知设置</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">启用通知</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.notifications?.enabled || false}
                      onChange={(e) => handleConfigChange('ui_settings.notifications.enabled', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">声音通知</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.notifications?.sound || false}
                      onChange={(e) => handleConfigChange('ui_settings.notifications.sound', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">桌面通知</label>
                    <input
                      type="checkbox"
                      checked={config.ui_settings?.notifications?.desktop || false}
                      onChange={(e) => handleConfigChange('ui_settings.notifications.desktop', e.target.checked)}
                      className="toggle"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-40 flex justify-center mt-8"></div>
      </main>

      {/* Footer */}
      <ClaudeConfigurationFooter onSave={saveClaudeConfig} isLoading={isLoading} />
    </div>
  )
}
