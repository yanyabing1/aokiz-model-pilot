'use client';

import { useState } from 'react';

interface Configuration {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  theme: string;
  autoSave: boolean;
  interfaceDensity: number;
  accentColor: string;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  codeFolding: boolean;
  fontSize: number;
  
  // API Settings
  apiEndpoint: string;
  streaming: boolean;
  timeout: number;
  maxRetries: number;
  rateLimitRequests: number;
  rateLimitTokens: number;
  
  // File & Workspace Settings
  fileExclusions: string;
  multiFileContext: boolean;
  contextWindow: number;
  includeHiddenFiles: boolean;
  followSymlinks: boolean;
  
  // Privacy & Security
  dataRetentionDays: number;
  disableTelemetry: boolean;
  disableAnalytics: boolean;
  localProcessingOnly: boolean;
  
  // Custom Tools
  customToolsEnabled: boolean;
  toolPaths: string;
  
  // UI Settings
  showMinimap: boolean;
  notificationsEnabled: boolean;
  notificationsSound: boolean;
  notificationsDesktop: boolean;
}

const defaultConfiguration: Configuration = {
  model: 'Claude 3 Sonnet',
  temperature: 0.7,
  maxTokens: 10000000,
  topP: 0.9,
  systemPrompt: `You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

If a question does not make sense or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.`,
  theme: 'dark',
  autoSave: true,
  interfaceDensity: 1,
  accentColor: 'primary',
  tabSize: 4,
  wordWrap: true,
  lineNumbers: true,
  codeFolding: false,
  fontSize: 14,
  
  // API Settings
  apiEndpoint: 'https://api.anthropic.com',
  streaming: true,
  timeout: 30000,
  maxRetries: 3,
  rateLimitRequests: 60,
  rateLimitTokens: 40000,
  
  // File & Workspace Settings
  fileExclusions: 'node_modules/**, .git/**, dist/**, build/**, *.log',
  multiFileContext: true,
  contextWindow: 10000,
  includeHiddenFiles: false,
  followSymlinks: false,
  
  // Privacy & Security
  dataRetentionDays: 30,
  disableTelemetry: false,
  disableAnalytics: false,
  localProcessingOnly: false,
  
  // Custom Tools
  customToolsEnabled: false,
  toolPaths: '',
  
  // UI Settings
  showMinimap: true,
  notificationsEnabled: true,
  notificationsSound: true,
  notificationsDesktop: false,
};

const recentConfigurations = [
  {
    name: 'Default Setup',
    model: 'Claude 3 Sonnet',
    temperature: 0.7,
    lastModified: 'Today, 14:30'
  },
  {
    name: 'Creative Writing',
    model: 'Claude 3 Opus',
    temperature: 0.9,
    lastModified: 'Yesterday, 09:45'
  },
  {
    name: 'Technical Analysis',
    model: 'Claude 2.1',
    temperature: 0.3,
    lastModified: '2 days ago'
  }
];

const modelOptions = [
  'GLM-4.5',
  'GLM-4.5-Air',
  'Claude Instant',
  'Claude 2',
  'Claude 2.1',
  'Claude 3 Opus',
  'Claude 3 Sonnet'
];

const themeOptions = [
  { name: 'Dark', value: 'dark', gradient: 'from-gray-800 to-gray-900' },
  { name: 'Light', value: 'light', gradient: 'from-gray-200 to-gray-300' },
  { name: 'Neon', value: 'neon', gradient: 'from-blue-900 to-purple-900' }
];

const colorOptions = [
  'primary', 'secondary', 'accent', 'green-500', 'yellow-500', 'red-500', 'gray-500'
];

export default function ConfigurationManager() {
  const [config, setConfig] = useState<Configuration>(defaultConfiguration);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleSliderChange = (field: keyof Configuration, value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof Configuration, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfiguration = () => {
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 3000);
  };

  const getSliderWidth = (value: number, min: number, max: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="bg-dark min-h-screen font-inter text-light bg-grid overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-2/3 left-2/3 w-80 h-80 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="py-6 px-4 md:px-8 flex justify-between items-center border-b border-primary/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <i className="fas fa-cogs text-white text-xl"></i>
          </div>
          <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold bg-gradient-to-r from-white to-primary text-gradient">
            Claude Configuration Manager
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-primary/20 transition-all duration-300">
            <i className="fas fa-question-circle text-xl text-primary/80 hover:text-primary"></i>
          </button>
          <button className="p-2 rounded-full hover:bg-primary/20 transition-all duration-300">
            <i className="fas fa-user-circle text-xl text-primary/80 hover:text-primary"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Model Settings Card */}
          <div className="lg:col-span-1 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                <i className="fas fa-brain text-primary"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Model Settings</h2>
            </div>
            <div className="space-y-6">
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <div className="relative">
                  <select 
                    value={config.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 pr-10 text-light appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    {modelOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
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
                  <span className="text-sm text-primary">{config.temperature}</span>
                </div>
                <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 slider-track" 
                    style={{ width: `${getSliderWidth(config.temperature, 0, 1)}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={config.temperature}
                    onChange={(e) => handleSliderChange('temperature', parseFloat(e.target.value))}
                    className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10 slider-thumb"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Precise</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={config.maxTokens}
                    onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
                    min="1" 
                    max="20000" 
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
                  <span className="text-sm text-primary">{config.topP}</span>
                </div>
                <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 slider-track" 
                    style={{ width: `${getSliderWidth(config.topP, 0, 1)}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={config.topP}
                    onChange={(e) => handleSliderChange('topP', parseFloat(e.target.value))}
                    className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10 slider-thumb"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Deterministic</span>
                  <span>Diverse</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Prompt Card */}
          <div className="lg:col-span-2 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mr-3">
                <i className="fas fa-comment-dots text-secondary"></i>
              </div>
              <h2 className="text-xl font-bold text-white">System Prompt</h2>
            </div>
            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400 text-xs">
                <i className="fas fa-info-circle mr-1"></i>
                Guide AI behavior with system instructions
              </div>
              <textarea 
                value={config.systemPrompt}
                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                className="w-full h-64 bg-dark/50 border border-secondary/40 rounded-lg p-4 pt-10 text-light font-mono text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all resize-none"
                placeholder="Enter system prompt here..."
              />
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg flex items-center transition-all duration-300">
                <i className="fas fa-save mr-2"></i>
                Save Prompt
              </button>
            </div>
          </div>

          {/* Appearance Card */}
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mr-3">
                <i className="fas fa-palette text-accent"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Appearance</h2>
            </div>
            <div className="space-y-6">
              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((theme) => (
                    <div 
                      key={theme.value}
                      className={`theme-option rounded-lg p-3 ${theme.value === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-dark border border-gray-700'} cursor-pointer hover:border-primary transition-all relative ${config.theme === theme.value ? 'border-primary' : ''}`}
                      onClick={() => handleInputChange('theme', theme.value)}
                    >
                      <div className={`w-full h-10 rounded bg-gradient-to-r ${theme.gradient} mb-2`}></div>
                      <div className={`text-xs text-center ${theme.value === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>
                        {theme.name}
                      </div>
                      {config.theme === theme.value && (
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Save */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <i className="fas fa-sync-alt text-primary/60 mr-2"></i>
                  Auto Save
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.autoSave}
                    onChange={(e) => handleInputChange('autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Interface Density */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Interface Density</label>
                <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 slider-track" 
                    style={{ width: `${getSliderWidth(config.interfaceDensity, 0, 2)}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    value={config.interfaceDensity}
                    onChange={(e) => handleSliderChange('interfaceDensity', parseInt(e.target.value))}
                    className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10 slider-thumb"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Compact</span>
                  <span>Comfortable</span>
                  <span>Spacious</span>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                <div className="flex space-x-3">
                  {colorOptions.map(color => (
                    <button 
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color} ${config.accentColor === color ? 'ring-2 ring-' + color + '/50' : ''}`}
                      onClick={() => handleInputChange('accentColor', color)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Editor Settings Card */}
          <div className="glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow hover:shadow-glow-lg transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                <i className="fas fa-code text-green-500"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Editor Settings</h2>
            </div>
            <div className="space-y-6">
              {/* Tab Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tab Size</label>
                <div className="relative w-24">
                  <input 
                    type="number" 
                    value={config.tabSize}
                    onChange={(e) => handleInputChange('tabSize', parseInt(e.target.value))}
                    min="2" 
                    max="8" 
                    className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <i className="fas fa-align-left text-primary/60 mr-2"></i>
                  Word Wrap
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.wordWrap}
                    onChange={(e) => handleInputChange('wordWrap', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <i className="fas fa-list-ol text-primary/60 mr-2"></i>
                  Line Numbers
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.lineNumbers}
                    onChange={(e) => handleInputChange('lineNumbers', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Code Folding */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <i className="fas fa-chevron-down text-primary/60 mr-2"></i>
                  Code Folding
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.codeFolding}
                    onChange={(e) => handleInputChange('codeFolding', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Font Size</label>
                  <span className="text-sm text-primary">{config.fontSize}px</span>
                </div>
                <div className="relative h-6 slider-track-bg rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 slider-track" 
                    style={{ width: `${getSliderWidth(config.fontSize, 12, 20)}%` }}
                  ></div>
                  <input 
                    type="range" 
                    min="12" 
                    max="20" 
                    value={config.fontSize}
                    onChange={(e) => handleSliderChange('fontSize', parseInt(e.target.value))}
                    className="absolute left-0 top-0 w-full h-full appearance-none bg-transparent z-10 slider-thumb"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Configuration */}
          <div className="lg:col-span-2 flex items-end justify-end">
            <button 
              onClick={handleSaveConfiguration}
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center"
            >
              <i className="fas fa-save mr-2"></i>
              Save Configuration
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>

        {/* Recent Configurations */}
        <div className="mt-12 glass-dark rounded-2xl p-6 border border-primary/30 shadow-glow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                <i className="fas fa-history text-primary"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Recent Configurations</h2>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              View All
              <i className="fas fa-chevron-right ml-1 text-xs"></i>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-dark/30">
                <tr>
                  <th scope="col" className="px-4 py-3 rounded-l-lg">Name</th>
                  <th scope="col" className="px-4 py-3">Model</th>
                  <th scope="col" className="px-4 py-3">Temperature</th>
                  <th scope="col" className="px-4 py-3">Last Modified</th>
                  <th scope="col" className="px-4 py-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentConfigurations.map((config, index) => (
                  <tr key={index} className="bg-dark/50 border-b border-gray-800 hover:bg-dark/70 transition-colors">
                    <td className="px-4 py-4 font-medium text-white">{config.name}</td>
                    <td className="px-4 py-4 text-gray-400">{config.model}</td>
                    <td className="px-4 py-4 text-gray-400">{config.temperature}</td>
                    <td className="px-4 py-4 text-gray-400">{config.lastModified}</td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-primary hover:text-primary/80 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-green-500 hover:text-green-500/80 mr-3">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="text-gray-500 hover:text-gray-400">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 px-4 md:px-8 border-t border-primary/30 glass-dark">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-2">
              <i className="fas fa-cogs text-primary"></i>
            </div>
            <span className="text-sm text-gray-400">Claude Configuration Manager v1.0</span>
          </div>
          <div className="flex space-x-6">
            <a href="javascript:void(0);" className="text-sm text-gray-400 hover:text-primary transition-colors">Documentation</a>
            <a href="javascript:void(0);" className="text-sm text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="javascript:void(0);" className="text-sm text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Save Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative bg-dark border border-primary/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-glow-lg transform transition-all">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Configuration Saved</h3>
              <p className="text-gray-400 mb-6">Your settings have been successfully saved to the cloud</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 py-3 px-4 bg-primary rounded-lg text-white hover:bg-primary/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}