/** @type {import('next').NextConfig} */
const nextConfig = {
  // 优化热更新性能
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 优化开发模式构建速度
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
      
      // 优化模块解析
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname, './src'),
      };
    }
    return config;
  },
  
  // 启用实验性功能以获得更好的热更新
  experimental: {
    // 启用服务器组件
    serverComponentsExternalPackages: [],
    // 优化包导入
    optimizePackageImports: ['antd'],
  },
  
  // 转译配置
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker'],
  
  // 压缩配置
  compress: true,
  
  
  // 图片优化
  images: {
    domains: ['design.gemcoder.com'],
  },
  
  // 开发服务器配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;