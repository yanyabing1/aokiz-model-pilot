'use client';

import { useState } from 'react';
import { ClaudeConfig } from '@/lib/config';

interface AdvancedFeaturesProps {
  config: ClaudeConfig;
  onConfigChange: (path: string, value: any) => void;
}

export default function AdvancedFeatures({ config, onConfigChange }: AdvancedFeaturesProps) {
  const [newToolPath, setNewToolPath] = useState('');

  const addToolPath = () => {
    if (newToolPath.trim()) {
      const currentPaths = config.custom_tools?.tool_paths || [];
      onConfigChange('custom_tools.tool_paths', [...currentPaths, newToolPath.trim()]);
      setNewToolPath('');
    }
  };

  const removeToolPath = (index: number) => {
    const currentPaths = config.custom_tools?.tool_paths || [];
    onConfigChange('custom_tools.tool_paths', currentPaths.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Custom Tools */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-tools text-primary mr-2"></i>
          自定义工具
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">启用自定义工具</div>
              <div className="text-xs text-gray-400">允许加载和使用外部工具</div>
            </div>
            <input
              type="checkbox"
              checked={config.custom_tools?.enabled || false}
              onChange={(e) => onConfigChange('custom_tools.enabled', e.target.checked)}
              className="toggle"
            />
          </div>

          {config.custom_tools?.enabled && (
            <>
              {/* Tool Paths */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">工具路径</label>
                <div className="space-y-2">
                  {config.custom_tools.tool_paths?.map((path: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={path}
                        readOnly
                        className="flex-1 bg-dark/50 border border-gray-600 rounded-lg py-2 px-3 text-light text-sm"
                      />
                      <button
                        onClick={() => removeToolPath(index)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newToolPath}
                      onChange={(e) => setNewToolPath(e.target.value)}
                      placeholder="输入工具路径..."
                      className="flex-1 bg-dark/50 border border-primary/40 rounded-lg py-2 px-3 text-light text-sm"
                    />
                    <button
                      onClick={addToolPath}
                      className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">权限设置</label>
                <div className="space-y-2">
                  {['read', 'write', 'execute'].map((permission) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">{permission}</span>
                      <input
                        type="checkbox"
                        checked={config.custom_tools?.permissions?.includes(permission) || false}
                        onChange={(e) => {
                          const currentPermissions = config.custom_tools?.permissions || [];
                          if (e.target.checked) {
                            onConfigChange('custom_tools.permissions', [...currentPermissions, permission]);
                          } else {
                            onConfigChange('custom_tools.permissions', currentPermissions.filter((p: string) => p !== permission));
                          }
                        }}
                        className="toggle"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Performance Settings */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-tachometer-alt text-secondary mr-2"></i>
          性能设置
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">缓存大小 (MB)</label>
            <input
              type="number"
              min="100"
              max="10000"
              value={1024} // Default value
              onChange={(e) => console.log('Cache size:', e.target.value)}
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">并发请求数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={3} // Default value
              onChange={(e) => console.log('Concurrent requests:', e.target.value)}
              className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
            />
          </div>
        </div>
      </div>

      {/* Debug Settings */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-bug text-accent mr-2"></i>
          调试设置
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">调试模式</div>
              <div className="text-xs text-gray-400">启用详细的调试日志</div>
            </div>
            <input
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => console.log('Debug mode:', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">开发者工具</div>
              <div className="text-xs text-gray-400">启用开发者功能</div>
            </div>
            <input
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => console.log('Dev tools:', e.target.checked)}
              className="toggle"
            />
          </div>
        </div>
      </div>

      {/* Experimental Features */}
      <div className="glass-dark rounded-xl p-6 border border-yellow-500/30">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-flask text-yellow-500 mr-2"></i>
          实验性功能
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">新版本预览</div>
              <div className="text-xs text-gray-400">测试即将发布的功能</div>
            </div>
            <input
              type="checkbox"
              defaultChecked={false}
              onChange={(e) => console.log('Beta features:', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center text-yellow-400 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              警告：实验性功能可能不稳定，请谨慎使用
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}