# Aokiz Model Pilot

Aokiz Model Pilot 是一个功能强大的 Claude Code 配置管理平台，专为简化 Claude AI 工具的配置流程而设计。通过直观的 Web 界面，用户可以轻松管理 Claude Code 的所有核心设置，包括模型参数、权限控制、第三方服务集成等，让 AI 辅助开发变得更加高效和安全。

## 项目概述

### 主要目标

- **简化配置管理**: 提供直观的界面来管理复杂的 Claude Code 配置
- **增强安全性**: 通过权限管理确保 Claude Code 的安全使用
- **促进集成**: 支持与各种第三方服务的无缝集成
- **提供监控**: 实时监控配置使用情况和性能指标

### 适用场景

- 开发团队需要统一管理 Claude Code 配置
- 企业环境中需要安全控制 AI 工具的使用
- 个人用户希望简化 Claude Code 的配置过程
- 需要与多个第三方服务集成的项目

## 功能特性

### 🎯 核心功能
- **Claude AI 配置管理**: 全局配置 Claude AI 模型参数，包括模型选择、温度、最大令牌数等
- **第三方服务集成**: 支持与多种第三方服务的 API 集成
- **实时配置更新**: 所有配置更改实时保存到 `~/.claude/settings.json`
- **可视化仪表板**: 提供配置状态和使用统计的可视化界面
- **权限管理**: 精细控制 Claude Code 的工具使用权限
- **环境变量配置**: 管理各种环境变量和 API 端点设置

### 🛠️ 技术特性
- **现代化 UI**: 基于 Next.js 14 和 Ant Design 构建的响应式界面
- **TypeScript 支持**: 完整的 TypeScript 类型安全
- **实时同步**: 配置更改即时同步到本地文件系统
- **数据可视化**: 使用 ECharts 提供配置统计图表
- **安全控制**: 内置安全权限管理，防止危险操作

## Claude Code 安装教程

### 前置要求

在开始之前，请确保您的系统满足以下要求：

- **Node.js**: 版本 18.0 或更高
- **npm**: 版本 8.0 或更高
- **操作系统**: macOS、Linux 或 Windows (WSL2)
- **Anthropic API 密钥**: 从 [Anthropic Console](https://console.anthropic.com) 获取

### 安装 Claude Code

#### 方法一：通过 npm 安装（推荐）

```bash
# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude-code --version
```

#### 方法二：通过 curl 安装

```bash
# 下载安装脚本
curl -fsSL https://claude.ai/install | sh

# 添加到 PATH（如果需要）
export PATH="$PATH:$HOME/.local/bin"
```

#### 方法三：通过 Homebrew 安装（macOS）

```bash
# 安装 Claude Code
brew install anthropic/tap/claude-code

# 验证安装
claude-code --version
```

### 配置 Claude Code

#### 1. 设置 API 密钥

```bash
# 设置 Anthropic API 密钥
export ANTHROPIC_API_KEY="your-api-key-here"

# 或者使用 claude-code 命令配置
claude-code auth login
```

#### 2. 初始化配置

```bash
# 创建默认配置文件
claude-code init

# 这将在 ~/.claude/settings.json 创建配置文件
```

#### 3. 验证配置

```bash
# 测试 Claude Code 是否正常工作
claude-code --help

# 检查当前配置
claude-code config show
```

### 快速开始

#### 安装项目依赖
```bash
npm install
```

#### 启动开发服务器
```bash
npm run dev
```

#### 访问应用
在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 常见问题解决

#### 1. 权限问题
```bash
# 如果遇到权限问题，可以尝试
sudo chown -R $(whoami) ~/.claude
```

#### 2. 网络问题
```bash
# 如果网络连接有问题，可以设置代理
export HTTP_PROXY="http://proxy.company.com:8080"
export HTTPS_PROXY="http://proxy.company.com:8080"
```

#### 3. 卸载 Claude Code
```bash
# 通过 npm 卸载
npm uninstall -g @anthropic-ai/claude-code

# 通过 Homebrew 卸载
brew uninstall claude-code

# 清理配置文件
rm -rf ~/.claude
```

## 配置文件

应用程序管理位于 `~/.claude/settings.json` 的配置文件，结构如下：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "BASH_DEFAULT_TIMEOUT_MS": "60000",
    "BASH_MAX_TIMEOUT_MS": "300000",
    "BASH_MAX_OUTPUT_LENGTH": "300000",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "8192",
    "MAX_THINKING_TOKENS": "8192",
    "MAX_MCP_OUTPUT_TOKENS": "1000000",
    "MCP_TIMEOUT": "30000",
    "MCP_TOOL_TIMEOUT": "60000"
  },
  "model": "claude-3-5-sonnet-20241022",
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(pnpm:*)",
      "Bash(node:*)",
      "Read(src/**)",
      "Edit(src/**)",
      "Write(src/**)",
      "Glob",
      "Grep",
      "LS",
      "Task",
      "TodoWrite",
      "MultiEdit(src/**)",
      "NotebookRead",
      "NotebookEdit(*.ipynb)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Edit(/etc/**)",
      "Write(/etc/**)"
    ],
    "additionalDirectories": [],
    "defaultMode": "acceptEdits"
  },
  "cleanupPeriodDays": 30,
  "includeCoAuthoredBy": true,
  "enableAllProjectMcpServers": false,
  "enabledMcpjsonServers": ["memory", "github"],
  "disabledMcpjsonServers": []
}
```

## 🔌 API 接口

- `GET /api/config` - 获取当前配置
- `POST /api/config` - 更新配置
- `GET /api/claude-config` - 获取 Claude Code 配置
- `POST /api/claude-config` - 更新 Claude Code 配置
- `GET /api/dashboard-stats` - 获取仪表板统计数据

## 🔗 Claude Code 第三方接入教程

### 基本配置

#### 1. API 密钥配置
在使用 Claude Code 进行第三方服务集成之前，您需要配置相应的 API 密钥：

```bash
# 设置 Anthropic API 密钥
export ANTHROPIC_API_KEY="your-api-key-here"

# 或者通过本应用配置界面设置
```

#### 2. 权限配置
Claude Code 的权限系统控制着 AI 可以执行的操作。通过本应用，您可以：

- **允许的操作**: 配置允许 Claude Code 执行的命令和工具
- **禁止的操作**: 设置安全限制，防止危险操作
- **目录访问**: 控制 Claude Code 可以访问的文件目录

### 第三方服务集成

#### GitHub 集成
```json
{
  "enabledMcpjsonServers": ["github"],
  "env": {
    "GITHUB_TOKEN": "your-github-token"
  }
}
```

#### 内存管理集成
```json
{
  "enabledMcpjsonServers": ["memory"],
  "env": {
    "MEMORY_DB_PATH": "/path/to/memory/db"
  }
}
```

#### 自定义 MCP 服务器
```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["your-custom-server"],
  "env": {
    "CUSTOM_SERVER_URL": "http://localhost:8080"
  }
}
```

### 高级配置

#### 环境变量管理
```json
{
  "env": {
    "ANTHROPIC_MODEL": "claude-3-5-sonnet-20241022",
    "ANTHROPIC_BASE_URL": "https://api.anthropic.com",
    "BASH_DEFAULT_TIMEOUT_MS": "60000",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "8192",
    "MAX_THINKING_TOKENS": "8192"
  }
}
```

#### 权限细粒度控制
```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Bash(pnpm:*)",
      "Read(src/**)",
      "Edit(src/**)",
      "Write(src/**)"
    ],
    "deny": [
      "Bash(rm -rf:*)",
      "Bash(sudo:*)",
      "Edit(/etc/**)"
    ],
    "defaultMode": "acceptEdits"
  }
}
```

### 使用流程

1. **启动配置管理器**
   ```bash
   npm run dev
   ```

2. **访问 Web 界面**
   打开 http://localhost:3000

3. **配置第三方服务**
   - 在界面中添加相应的 API 密钥
   - 配置权限设置
   - 启用所需的 MCP 服务器

4. **验证配置**
   - 使用配置界面中的测试功能
   - 检查 Claude Code 是否能正常访问第三方服务

### 最佳实践

- **安全性**: 不要在生产环境中使用默认密钥
- **权限最小化**: 只授予必要的权限
- **定期更新**: 定期更新 API 密钥和配置
- **监控**: 使用仪表板监控配置使用情况

### 故障排除

#### 常见问题
1. **配置不生效**: 检查 `~/.claude/settings.json` 文件权限
2. **API 连接失败**: 验证网络连接和 API 密钥
3. **权限错误**: 检查权限配置是否正确

#### 调试模式
```bash
# 启用详细日志
export CLAUDE_CODE_DEBUG=1
npm run dev
```

## 🚀 开发脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run type-check` - 运行 TypeScript 类型检查
- `npm run format` - 使用 Prettier 格式化代码
- `npm run dev:full` - 启动开发服务器并运行类型检查

## 🛠️ 技术栈

- **前端框架**: Next.js 14
- **UI 组件**: Ant Design
- **样式**: Tailwind CSS
- **图表**: ECharts
- **类型检查**: TypeScript
- **代码格式化**: Prettier
- **代码检查**: ESLint

## 许可证

MIT License