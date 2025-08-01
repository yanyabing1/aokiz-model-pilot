'use client';

import { ClaudeConfig } from '@/lib/config';
import { useEffect, useState } from 'react';
import AdvancedFeatures from './AdvancedFeatures';
import ClaudeConfigurationFooter from './ClaudeConfigurationFooter';
import ClaudeConfigurationHeader from './ClaudeConfigurationHeader';
import LanguageSettings from './LanguageSettings';
import PrivacySettings from './PrivacySettings';
import UISettings from './UISettings';
import WorkspaceSettings from './WorkspaceSettings';

export default function AdvancedClaudeConfiguration() {
  const [config, setConfig] = useState<ClaudeConfig>({
    model: 'Claude Instant',
    temperature: 0.7,
    max_tokens: 40960,
    top_p: 0.9,
    system_prompt: `你是一个有帮助、尊重和诚实的助手。始终尽可能有帮助地回答，同时保持安全。你的回答不应包含任何有害、不道德、种族主义、性别歧视、有毒、危险或非法的内容。请确保你的回答在社会上是无偏见的，并且是积极的。
如果一个问题的含义不清楚或事实上不连贯，请解释为什么而不是回答不正确的内容。如果你不知道问题的答案，请不要分享虚假信息。`,
    auto_save: true,
    theme: 'dark',
    
    // API Settings
    api_endpoint: 'https://api.anthropic.com',
    streaming: true,
    timeout: 30000,
    max_retries: 3,
    rate_limit: {
      requests_per_minute: 60,
      tokens_per_minute: 90000
    },
    
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
      auto_indent: true
    },
    
    // File & Workspace Settings
    file_exclusions: ['node_modules/**', '.git/**', '*.log', 'dist/**', 'build/**'],
    workspace_settings: {
      project_specific: true,
      multi_file_context: true,
      context_window: 200000,
      include_hidden_files: false,
      follow_symlinks: false
    },
    
    // Language Settings
    language_settings: {
      javascript: {
        tab_size: 2,
        formatter: 'prettier',
        linter: 'eslint',
        auto_completion: true
      },
      python: {
        tab_size: 4,
        formatter: 'black',
        linter: 'pylint',
        auto_completion: true
      },
      typescript: {
        tab_size: 2,
        formatter: 'prettier',
        linter: 'eslint',
        auto_completion: true
      }
    },
    
    // Privacy & Security
    privacy_settings: {
      data_retention_days: 30,
      disable_telemetry: false,
      disable_analytics: false,
      local_processing_only: false
    },
    
    // Advanced Features
    custom_tools: {
      enabled: true,
      tool_paths: [],
      permissions: ['read', 'write', 'execute']
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
        desktop: false
      }
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const loadedConfig = await response.json();
        setConfig(prev => ({ ...prev, ...loadedConfig }));
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        alert('配置已保存');
      } else {
        alert('保存失败');
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('保存失败');
    }
  };

  const handleConfigChange = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const tabs = [
    { id: 'basic', label: '基础设置', icon: 'fas fa-cog' },
    { id: 'api', label: 'API设置', icon: 'fas fa-plug' },
    { id: 'editor', label: '编辑器', icon: 'fas fa-code' },
    { id: 'workspace', label: '工作空间', icon: 'fas fa-folder' },
    { id: 'languages', label: '语言设置', icon: 'fas fa-language' },
    { id: 'privacy', label: '隐私安全', icon: 'fas fa-shield-alt' },
    { id: 'advanced', label: '高级功能', icon: 'fas fa-rocket' },
    { id: 'ui', label: '界面设置', icon: 'fas fa-palette' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen font-inter text-light bg-grid overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-2/3 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <ClaudeConfigurationHeader />

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto overflow-y-auto min-h-[calc(100vh-200px)]">
        {/* Tab Navigation */}
        <div className="mb-8 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
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
        </div>

        {/* Basic Settings */}
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Model Settings */}
            <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-brain text-primary mr-3"></i>
                模型设置
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">模型</label>
                  <select
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                    value={config.model}
                    onChange={(e) => handleConfigChange('model', e.target.value)}
                  >
                    <option value="Claude Instant">Claude Instant</option>
                    <option value="Claude 2">Claude 2</option>
                    <option value="Claude 2.1">Claude 2.1</option>
                    <option value="Claude 3 Opus">Claude 3 Opus</option>
                    <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
                    <option value="GLM-4.5">GLM-4.5</option>
                    <option value="GLM-4.5-Air">GLM-4.5-Air</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Temperature ({config.temperature})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.temperature}
                    onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">最大令牌数</label>
                  <input
                    type="number"
                    value={config.max_tokens}
                    onChange={(e) => handleConfigChange('max_tokens', parseInt(e.target.value))}
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Top P ({config.top_p})</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={config.top_p}
                    onChange={(e) => handleConfigChange('top_p', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div className="glass-dark rounded-2xl p-6 border border-secondary/30 shadow-glow">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <i className="fas fa-comment-dots text-secondary mr-3"></i>
                系统提示
              </h3>
              <textarea
                className="w-full h-64 bg-dark/50 border border-secondary/40 rounded-lg p-4 text-light font-mono text-sm resize-none"
                value={config.system_prompt}
                onChange={(e) => handleConfigChange('system_prompt', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* API Settings */}
        {activeTab === 'api' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-plug text-primary mr-3"></i>
              API设置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API端点</label>
                <input
                  type="text"
                  value={config.api_endpoint}
                  onChange={(e) => handleConfigChange('api_endpoint', e.target.value)}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">超时时间 (ms)</label>
                <input
                  type="number"
                  value={config.timeout}
                  onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">最大重试次数</label>
                <input
                  type="number"
                  value={config.max_retries}
                  onChange={(e) => handleConfigChange('max_retries', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">流式响应</label>
                <input
                  type="checkbox"
                  checked={config.streaming}
                  onChange={(e) => handleConfigChange('streaming', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">每分钟请求限制</label>
                <input
                  type="number"
                  value={config.rate_limit?.requests_per_minute || 60}
                  onChange={(e) => handleConfigChange('rate_limit.requests_per_minute', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">每分钟令牌限制</label>
                <input
                  type="number"
                  value={config.rate_limit?.tokens_per_minute || 90000}
                  onChange={(e) => handleConfigChange('rate_limit.tokens_per_minute', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
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
                  onChange={(e) => handleConfigChange('editor_settings.tab_size', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
                <input
                  type="number"
                  value={config.editor_settings?.font_size || 14}
                  onChange={(e) => handleConfigChange('editor_settings.font_size', parseInt(e.target.value))}
                  className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">自动换行</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.word_wrap || false}
                  onChange={(e) => handleConfigChange('editor_settings.word_wrap', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">行号</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.line_numbers || false}
                  onChange={(e) => handleConfigChange('editor_settings.line_numbers', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">代码折叠</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.code_folding || false}
                  onChange={(e) => handleConfigChange('editor_settings.code_folding', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">自动补全</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.auto_completion || false}
                  onChange={(e) => handleConfigChange('editor_settings.auto_completion', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">语法高亮</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.syntax_highlighting || false}
                  onChange={(e) => handleConfigChange('editor_settings.syntax_highlighting', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">小地图</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.minimap || false}
                  onChange={(e) => handleConfigChange('editor_settings.minimap', e.target.checked)}
                  className="toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">括号匹配</label>
                <input
                  type="checkbox"
                  checked={config.editor_settings?.bracket_matching || false}
                  onChange={(e) => handleConfigChange('editor_settings.bracket_matching', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>
        )}

        {/* Workspace Settings */}
        {activeTab === 'workspace' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-folder text-primary mr-3"></i>
              工作空间设置
            </h3>
            <WorkspaceSettings config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* Language Settings */}
        {activeTab === 'languages' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-language text-primary mr-3"></i>
              语言设置
            </h3>
            <LanguageSettings config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-shield-alt text-primary mr-3"></i>
              隐私与安全设置
            </h3>
            <PrivacySettings config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* Advanced Features */}
        {activeTab === 'advanced' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-rocket text-primary mr-3"></i>
              高级功能
            </h3>
            <AdvancedFeatures config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* UI Settings */}
        {activeTab === 'ui' && (
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <i className="fas fa-palette text-primary mr-3"></i>
              界面设置
            </h3>
            <UISettings config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={saveConfig}
            className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center"
          >
            <i className="fas fa-save mr-2"></i>
            保存到本地 Claude 配置
          </button>
        </div>
      </main>

      {/* Footer */}
      <ClaudeConfigurationFooter />
    </div>
  );
}