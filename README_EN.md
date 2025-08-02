# Aokiz Model Pilot

A comprehensive Next.js application for managing Claude AI configuration and integrating with third-party services. This project provides a user-friendly interface for configuring Claude Code settings, managing API connections, and monitoring usage statistics.

## Project Overview

Aokiz Model Pilot is a configuration management platform designed specifically for Claude Code, aiming to simplify and standardize the Claude AI configuration process. The platform provides an intuitive web interface for users to easily manage various Claude Code settings, including model parameters, permission control, third-party service integration, and more.

### Main Objectives

- **Simplify Configuration Management**: Provide an intuitive interface to manage complex Claude Code configurations
- **Enhance Security**: Ensure secure usage of Claude Code through permission management
- **Promote Integration**: Support seamless integration with various third-party services
- **Provide Monitoring**: Real-time monitoring of configuration usage and performance metrics

### Use Cases

- Development teams need unified management of Claude Code configurations
- Enterprise environments require secure control of AI tool usage
- Individual users want to simplify the Claude Code configuration process
- Projects requiring integration with multiple third-party services

## Features

### Core Features
- **Claude AI Configuration Management**: Globally configure Claude AI model parameters, including model selection, temperature, max tokens, etc.
- **Third-party Service Integration**: Support API integration with various third-party services
- **Real-time Configuration Updates**: All configuration changes are saved in real-time to `~/.claude/settings.json`
- **Visual Dashboard**: Provide visual interface for configuration status and usage statistics
- **Permission Management**: Fine-grained control over Claude Code tool usage permissions
- **Environment Variable Configuration**: Manage various environment variables and API endpoints

### Technical Features
- **Modern UI**: Responsive interface built with Next.js 14 and Ant Design
- **TypeScript Support**: Complete TypeScript type safety
- **Real-time Synchronization**: Configuration changes instantly synchronized to local file system
- **Data Visualization**: Configuration statistics charts using ECharts
- **Security Control**: Built-in security permission management to prevent dangerous operations

## Getting Started

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration File

The application manages a configuration file located at `~/.claude/settings.json` with the following structure:

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

## API Endpoints

- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `GET /api/claude-config` - Get Claude Code configuration
- `POST /api/claude-config` - Update Claude Code configuration
- `GET /api/dashboard-stats` - Get dashboard statistics

## Claude Code Third-party Integration Tutorial

### Basic Configuration

#### 1. API Key Configuration
Before using Claude Code for third-party service integration, you need to configure the corresponding API keys:

```bash
# Set Anthropic API key
export ANTHROPIC_API_KEY="your-api-key-here"

# Or set through the application configuration interface
```

#### 2. Permission Configuration
Claude Code's permission system controls what operations the AI can perform. Through this application, you can:

- **Allowed Operations**: Configure commands and tools that Claude Code is allowed to execute
- **Denied Operations**: Set security restrictions to prevent dangerous operations
- **Directory Access**: Control which file directories Claude Code can access

### Third-party Service Integration

#### GitHub Integration
```json
{
  "enabledMcpjsonServers": ["github"],
  "env": {
    "GITHUB_TOKEN": "your-github-token"
  }
}
```

#### Memory Management Integration
```json
{
  "enabledMcpjsonServers": ["memory"],
  "env": {
    "MEMORY_DB_PATH": "/path/to/memory/db"
  }
}
```

#### Custom MCP Server
```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["your-custom-server"],
  "env": {
    "CUSTOM_SERVER_URL": "http://localhost:8080"
  }
}
```

### Advanced Configuration

#### Environment Variable Management
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

#### Fine-grained Permission Control
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

### Usage Workflow

1. **Start Configuration Manager**
   ```bash
   npm run dev
   ```

2. **Access Web Interface**
   Open http://localhost:3000

3. **Configure Third-party Services**
   - Add corresponding API keys in the interface
   - Configure permission settings
   - Enable required MCP servers

4. **Verify Configuration**
   - Use the test functionality in the configuration interface
   - Check if Claude Code can normally access third-party services

### Best Practices

- **Security**: Do not use default keys in production environments
- **Permission Minimization**: Only grant necessary permissions
- **Regular Updates**: Regularly update API keys and configurations
- **Monitoring**: Use the dashboard to monitor configuration usage

### Troubleshooting

#### Common Issues
1. **Configuration Not Taking Effect**: Check `~/.claude/settings.json` file permissions
2. **API Connection Failure**: Verify network connection and API keys
3. **Permission Errors**: Check if permission configuration is correct

#### Debug Mode
```bash
# Enable detailed logging
export CLAUDE_CODE_DEBUG=1
npm run dev
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run dev:full` - Start development server with type checking

## Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Components**: Ant Design
- **Styling**: Tailwind CSS
- **Charts**: ECharts
- **Type Checking**: TypeScript
- **Code Formatting**: Prettier
- **Code Linting**: ESLint

## License

MIT License