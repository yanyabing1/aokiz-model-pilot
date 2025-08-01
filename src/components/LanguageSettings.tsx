'use client';

import { useState } from 'react';
import { ClaudeConfig } from '@/lib/config';

interface LanguageSettingsProps {
  config: ClaudeConfig;
  onConfigChange: (path: string, value: any) => void;
}

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'fab fa-js-square', color: 'text-yellow-400' },
  { id: 'typescript', name: 'TypeScript', icon: 'fab fa-js-square', color: 'text-blue-400' },
  { id: 'python', name: 'Python', icon: 'fab fa-python', color: 'text-green-400' },
  { id: 'java', name: 'Java', icon: 'fab fa-java', color: 'text-red-400' },
  { id: 'cpp', name: 'C++', icon: 'fas fa-code', color: 'text-purple-400' },
  { id: 'go', name: 'Go', icon: 'fab fa-golang', color: 'text-cyan-400' },
  { id: 'rust', name: 'Rust', icon: 'fab fa-rust', color: 'text-orange-400' },
  { id: 'php', name: 'PHP', icon: 'fab fa-php', color: 'text-indigo-400' },
];

export default function LanguageSettings({ config, onConfigChange }: LanguageSettingsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].id);

  const currentLanguageSettings = config.language_settings?.[selectedLanguage] || {};

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">选择语言</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                selectedLanguage === lang.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-600 bg-dark/50 text-gray-400 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              <i className={`${lang.icon} ${lang.color} mr-2`}></i>
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Language-specific Settings */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className={`${languages.find(l => l.id === selectedLanguage)?.icon} ${languages.find(l => l.id === selectedLanguage)?.color} mr-2`}></i>
          {languages.find(l => l.id === selectedLanguage)?.name} 设置
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">制表符大小</label>
            <select
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
              value={currentLanguageSettings.tab_size || 2}
              onChange={(e) => onConfigChange(`language_settings.${selectedLanguage}.tab_size`, parseInt(e.target.value))}
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">格式化工具</label>
            <select
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
              value={currentLanguageSettings.formatter || ''}
              onChange={(e) => onConfigChange(`language_settings.${selectedLanguage}.formatter`, e.target.value)}
            >
              <option value="">无</option>
              <option value="prettier">Prettier</option>
              <option value="black">Black</option>
              <option value="clang-format">Clang Format</option>
              <option value="gofmt">Go fmt</option>
              <option value="rustfmt">Rust fmt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">代码检查工具</label>
            <select
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
              value={currentLanguageSettings.linter || ''}
              onChange={(e) => onConfigChange(`language_settings.${selectedLanguage}.linter`, e.target.value)}
            >
              <option value="">无</option>
              <option value="eslint">ESLint</option>
              <option value="pylint">Pylint</option>
              <option value="flake8">Flake8</option>
              <option value="clang-tidy">Clang Tidy</option>
              <option value="golint">Go Lint</option>
              <option value="clippy">Rust Clippy</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">自动补全</label>
            <input
              type="checkbox"
              checked={currentLanguageSettings.auto_completion || false}
              onChange={(e) => onConfigChange(`language_settings.${selectedLanguage}.auto_completion`, e.target.checked)}
              className="toggle"
            />
          </div>
        </div>
      </div>

      {/* Preset Templates */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">预设模板</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              onConfigChange('language_settings.javascript', {
                tab_size: 2,
                formatter: 'prettier',
                linter: 'eslint',
                auto_completion: true
              });
            }}
            className="p-3 bg-dark/50 border border-gray-600 rounded-lg hover:border-primary transition-all text-left"
          >
            <div className="font-medium text-white">JavaScript/TypeScript</div>
            <div className="text-sm text-gray-400">2 空格缩进，Prettier + ESLint</div>
          </button>
          
          <button
            onClick={() => {
              onConfigChange('language_settings.python', {
                tab_size: 4,
                formatter: 'black',
                linter: 'pylint',
                auto_completion: true
              });
            }}
            className="p-3 bg-dark/50 border border-gray-600 rounded-lg hover:border-primary transition-all text-left"
          >
            <div className="font-medium text-white">Python</div>
            <div className="text-sm text-gray-400">4 空格缩进，Black + Pylint</div>
          </button>
          
          <button
            onClick={() => {
              onConfigChange('language_settings.go', {
                tab_size: 4,
                formatter: 'gofmt',
                linter: 'golint',
                auto_completion: true
              });
            }}
            className="p-3 bg-dark/50 border border-gray-600 rounded-lg hover:border-primary transition-all text-left"
          >
            <div className="font-medium text-white">Go</div>
            <div className="text-sm text-gray-400">4 空格缩进，标准工具链</div>
          </button>
        </div>
      </div>
    </div>
  );
}