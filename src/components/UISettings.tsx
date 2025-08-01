'use client';

import { ClaudeConfig } from '@/lib/config';

interface UISettingsProps {
  config: ClaudeConfig;
  onConfigChange: (path: string, value: any) => void;
}

const accentColors = [
  { name: '蓝色', value: '#165DFF' },
  { name: '青色', value: '#0FC6C2' },
  { name: '紫色', value: '#722ED1' },
  { name: '绿色', value: '#22C55E' },
  { name: '黄色', value: '#EAB308' },
  { name: '红色', value: '#EF4444' },
  { name: '灰色', value: '#6B7280' },
];

const densityOptions = [
  { value: 'compact', label: '紧凑', icon: 'fas fa-compress' },
  { value: 'comfortable', label: '舒适', icon: 'fas fa-equals' },
  { value: 'spacious', label: '宽敞', icon: 'fas fa-expand' },
];

export default function UISettings({ config, onConfigChange }: UISettingsProps) {
  return (
    <div className="space-y-6">
      {/* Interface Density */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-th text-primary mr-2"></i>
          界面密度
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          {densityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onConfigChange('ui_settings.interface_density', option.value)}
              className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                config.ui_settings?.interface_density === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-600 bg-dark/50 hover:border-gray-500'
              }`}
            >
              <i className={`${option.icon} text-xl ${
                config.ui_settings?.interface_density === option.value ? 'text-primary' : 'text-gray-400'
              }`}></i>
              <span className="text-sm font-medium text-gray-300">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-palette text-secondary mr-2"></i>
          强调色
        </h4>
        
        <div className="grid grid-cols-7 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onConfigChange('ui_settings.accent_color', color.value)}
              className={`w-12 h-12 rounded-full transition-all relative ${
                config.ui_settings?.accent_color === color.value
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-dark'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              {config.ui_settings?.accent_color === color.value && (
                <i className="fas fa-check text-white absolute inset-0 flex items-center justify-center"></i>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-font text-accent mr-2"></i>
          字体设置
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">字体大小</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="12"
                max="20"
                value={config.ui_settings?.font_size || 14}
                onChange={(e) => onConfigChange('ui_settings.font_size', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-primary min-w-[50px]">
                {config.ui_settings?.font_size || 14}px
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">字体族</label>
            <select
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
              value="Inter"
              onChange={(e) => console.log('Font family:', e.target.value)}
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Lato">Lato</option>
              <option value="Montserrat">Montserrat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editor Display */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-code text-green-500 mr-2"></i>
          编辑器显示
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">显示行号</div>
              <div className="text-xs text-gray-400">在编辑器中显示行号</div>
            </div>
            <input
              type="checkbox"
              checked={config.ui_settings?.show_line_numbers || false}
              onChange={(e) => onConfigChange('ui_settings.show_line_numbers', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">显示小地图</div>
              <div className="text-xs text-gray-400">在编辑器右侧显示代码小地图</div>
            </div>
            <input
              type="checkbox"
              checked={config.ui_settings?.show_minimap || false}
              onChange={(e) => onConfigChange('ui_settings.show_minimap', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">自动换行</div>
              <div className="text-xs text-gray-400">长行自动换行显示</div>
            </div>
            <input
              type="checkbox"
              checked={config.ui_settings?.word_wrap || false}
              onChange={(e) => onConfigChange('ui_settings.word_wrap', e.target.checked)}
              className="toggle"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-bell text-yellow-500 mr-2"></i>
          通知设置
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">启用通知</div>
              <div className="text-xs text-gray-400">显示系统通知</div>
            </div>
            <input
              type="checkbox"
              checked={config.ui_settings?.notifications?.enabled || false}
              onChange={(e) => onConfigChange('ui_settings.notifications.enabled', e.target.checked)}
              className="toggle"
            />
          </div>

          {config.ui_settings?.notifications?.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-300">声音提醒</div>
                  <div className="text-xs text-gray-400">播放通知声音</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.ui_settings?.notifications?.sound || false}
                  onChange={(e) => onConfigChange('ui_settings.notifications.sound', e.target.checked)}
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-300">桌面通知</div>
                  <div className="text-xs text-gray-400">显示桌面通知</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.ui_settings?.notifications?.desktop || false}
                  onChange={(e) => onConfigChange('ui_settings.notifications.desktop', e.target.checked)}
                  className="toggle"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Theme Preview */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-eye text-purple-500 mr-2"></i>
          主题预览
        </h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-dark rounded-lg border border-gray-600">
            <div className="text-sm font-medium text-white mb-2">深色主题</div>
            <div className="space-y-2">
              <div className="h-2 bg-primary rounded"></div>
              <div className="h-2 bg-secondary rounded"></div>
              <div className="h-2 bg-accent rounded"></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
            <div className="text-sm font-medium text-gray-800 mb-2">浅色主题</div>
            <div className="space-y-2">
              <div className="h-2 bg-blue-500 rounded"></div>
              <div className="h-2 bg-green-500 rounded"></div>
              <div className="h-2 bg-purple-500 rounded"></div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-sm font-medium text-white mb-2">霓虹主题</div>
            <div className="space-y-2">
              <div className="h-2 bg-cyan-400 rounded"></div>
              <div className="h-2 bg-pink-400 rounded"></div>
              <div className="h-2 bg-yellow-400 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}