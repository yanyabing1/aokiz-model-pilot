'use client';

import { ClaudeConfig } from '@/lib/config';

interface PrivacySettingsProps {
  config: ClaudeConfig;
  onConfigChange: (path: string, value: any) => void;
}

export default function PrivacySettings({ config, onConfigChange }: PrivacySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Data Retention */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-database text-primary mr-2"></i>
          数据保留
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">数据保留天数</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="365"
              value={config.privacy_settings?.data_retention_days || 30}
              onChange={(e) => onConfigChange('privacy_settings.data_retention_days', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-primary min-w-[60px]">
              {config.privacy_settings?.data_retention_days || 30} 天
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            超过此天数的数据将被自动删除
          </p>
        </div>
      </div>

      {/* Telemetry & Analytics */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-chart-line text-secondary mr-2"></i>
          遥测与分析
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">禁用遥测</div>
              <div className="text-xs text-gray-400">不发送使用统计和性能数据</div>
            </div>
            <input
              type="checkbox"
              checked={config.privacy_settings?.disable_telemetry || false}
              onChange={(e) => onConfigChange('privacy_settings.disable_telemetry', e.target.checked)}
              className="toggle"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-300">禁用分析</div>
              <div className="text-xs text-gray-400">不收集使用习惯和功能使用情况</div>
            </div>
            <input
              type="checkbox"
              checked={config.privacy_settings?.disable_analytics || false}
              onChange={(e) => onConfigChange('privacy_settings.disable_analytics', e.target.checked)}
              className="toggle"
            />
          </div>
        </div>
      </div>

      {/* Processing Location */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-server text-accent mr-2"></i>
          处理位置
        </h4>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-300">仅本地处理</div>
            <div className="text-xs text-gray-400">所有数据仅在本地处理，不发送到外部服务器</div>
          </div>
          <input
            type="checkbox"
            checked={config.privacy_settings?.local_processing_only || false}
            onChange={(e) => onConfigChange('privacy_settings.local_processing_only', e.target.checked)}
            className="toggle"
          />
        </div>
        
        {config.privacy_settings?.local_processing_only && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center text-yellow-400 text-sm">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              注意：启用此选项可能会限制某些功能的可用性
            </div>
          </div>
        )}
      </div>

      {/* Data Export */}
      <div className="glass-dark rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <i className="fas fa-download text-green-500 mr-2"></i>
          数据导出
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-3 bg-dark/50 border border-gray-600 rounded-lg hover:border-primary transition-all flex items-center justify-center">
            <i className="fas fa-file-export mr-2"></i>
            导出配置数据
          </button>
          
          <button className="p-3 bg-dark/50 border border-gray-600 rounded-lg hover:border-primary transition-all flex items-center justify-center">
            <i className="fas fa-trash-alt mr-2"></i>
            清除所有数据
          </button>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="text-center">
        <button className="text-sm text-gray-400 hover:text-primary transition-colors">
          <i className="fas fa-shield-alt mr-1"></i>
          查看隐私政策
        </button>
      </div>
    </div>
  );
}