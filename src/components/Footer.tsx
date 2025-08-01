export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>© 2024 管理系统</span>
            <span>|</span>
            <a href="#" className="hover:text-primary">隐私政策</a>
            <span>|</span>
            <a href="#" className="hover:text-primary">服务条款</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>状态:</span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                运行正常
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="text-gray-500 hover:text-primary">
                <i className="fas fa-cog"></i>
              </button>
              <button className="text-gray-500 hover:text-primary">
                <i className="fas fa-question-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}