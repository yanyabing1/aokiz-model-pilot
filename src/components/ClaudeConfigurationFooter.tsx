'use client'

import { Spin } from 'antd';

interface ClaudeConfigurationFooterProps {
  onSave: () => void
  isLoading: boolean
}

export default function ClaudeConfigurationFooter({ onSave, isLoading }: ClaudeConfigurationFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-6 px-4 md:px-8 border-t border-primary/30 glass-dark z-50 bg-dark/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-2">
            <i className="fas fa-cogs text-primary"></i>
          </div>
          <span className="text-sm text-gray-400">Claude 配置管理器 v1.0</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>状态:</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              运行正常
            </span>
          </div>
          
          <div className="flex flex-1 justify-center">
            <button
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: "16px"
                  }}
                  onClick={onSave}
                >
                  {isLoading ? (
                    <>
                      <Spin size="small" className="mr-2" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      保存配置
                    </>
                  )}
                </button>
          </div>
        </div>
      </div>
    </footer>
  );
}