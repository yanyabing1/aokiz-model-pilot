'use client';

import { ClaudeConfig } from '@/lib/config';

interface WorkspaceSettingsProps {
  config: ClaudeConfig;
  onConfigChange: (path: string, value: any) => void;
}

export default function WorkspaceSettings({ config, onConfigChange }: WorkspaceSettingsProps) {
  return (
    <div className="space-y-6">
      {/* File Exclusions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">文件排除模式</label>
        <textarea
          className="w-full h-32 bg-dark/50 border border-primary/40 rounded-lg p-4 text-light font-mono text-sm resize-none"
          value={(config.file_exclusions || []).join('\n')}
          onChange={(e) => onConfigChange('file_exclusions', e.target.value.split('\n').filter(Boolean))}
          placeholder="node_modules/**&#10;.git/**&#10;*.log"
        />
        <p className="text-xs text-gray-400 mt-1">每行一个排除模式，支持 glob 语法</p>
      </div>

      {/* Workspace Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">项目特定配置</label>
          <input
            type="checkbox"
            checked={config.workspace_settings?.project_specific || false}
            onChange={(e) => onConfigChange('workspace_settings.project_specific', e.target.checked)}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">多文件上下文</label>
          <input
            type="checkbox"
            checked={config.workspace_settings?.multi_file_context || false}
            onChange={(e) => onConfigChange('workspace_settings.multi_file_context', e.target.checked)}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">包含隐藏文件</label>
          <input
            type="checkbox"
            checked={config.workspace_settings?.include_hidden_files || false}
            onChange={(e) => onConfigChange('workspace_settings.include_hidden_files', e.target.checked)}
            className="toggle"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">跟随符号链接</label>
          <input
            type="checkbox"
            checked={config.workspace_settings?.follow_symlinks || false}
            onChange={(e) => onConfigChange('workspace_settings.follow_symlinks', e.target.checked)}
            className="toggle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">上下文窗口大小</label>
          <input
            type="number"
            value={config.workspace_settings?.context_window || 200000}
            onChange={(e) => onConfigChange('workspace_settings.context_window', parseInt(e.target.value))}
            className="w-full bg-dark/50 border border-primary/40 rounded-lg py-3 px-4 text-light"
          />
          <p className="text-xs text-gray-400 mt-1">字符数</p>
        </div>
      </div>
    </div>
  );
}