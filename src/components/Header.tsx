'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">管理系统</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="/" className="text-gray-900 hover:text-primary px-3 py-2 text-sm font-medium">
                基础配置
              </a>
              <a href="/advanced-config" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
                高级配置
              </a>
              <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium">
                数据分析
              </a>
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-bell"></i>
            </button>
            <div className="flex items-center space-x-3">
              <img
                className="h-8 w-8 rounded-full"
                src="https://design.gemcoder.com/staticResource/echoAiSystemImages/25c03b5ab94130e20b2ddb099e80c0ec.png"
                alt="用户头像"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">GOGO</span>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <a href="/" className="text-gray-900 hover:text-primary block px-3 py-2 text-base font-medium">
              基础配置
            </a>
            <a href="/advanced-config" className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
              高级配置
            </a>
            <a href="#" className="text-gray-500 hover:text-primary block px-3 py-2 text-base font-medium">
              数据分析
            </a>
          </div>
        </div>
      )}
    </header>
  );
}