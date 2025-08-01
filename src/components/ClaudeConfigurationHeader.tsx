'use client';

import { useState } from 'react';

export default function ClaudeConfigurationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 py-6 px-4 md:px-8 flex justify-between items-center border-b border-primary/30 z-50 bg-dark/90 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <i className="fas fa-cogs text-white text-xl"></i>
        </div>
        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold bg-gradient-to-r from-white to-primary text-gradient">
          Claude 配置管理器
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-primary/20 transition-all duration-300">
          <i className="fas fa-question-circle text-xl text-primary/80 hover:text-primary"></i>
        </button>
        <button className="p-2 rounded-full hover:bg-primary/20 transition-all duration-300">
          <i className="fas fa-user-circle text-xl text-primary/80 hover:text-primary"></i>
        </button>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-primary/80 hover:text-primary p-2 rounded-full hover:bg-primary/20 transition-all duration-300"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-dark/95 backdrop-blur-sm border-t border-primary/30 md:hidden">
          <div className="px-4 py-3 space-y-2">
            <a href="#" className="block text-light hover:text-primary transition-colors py-2">
              <i className="fas fa-cog mr-2"></i>
              配置管理
            </a>
            <a href="#" className="block text-light hover:text-primary transition-colors py-2">
              <i className="fas fa-history mr-2"></i>
              历史记录
            </a>
            <a href="#" className="block text-light hover:text-primary transition-colors py-2">
              <i className="fas fa-cog mr-2"></i>
              设置
            </a>
          </div>
        </div>
      )}
    </header>
  );
}