#!/bin/bash

echo "测试 Claude Code 安装检测功能"
echo "================================"

# 测试 API 端点
echo "1. 测试检测 API..."
curl -s http://localhost:3001/api/claude-install | jq .

echo ""
echo "2. 检查本地 Claude Code 命令..."
which claude-code

echo ""
echo "3. 如果存在，检查版本..."
if command -v claude-code &> /dev/null; then
    claude-code --version
else
    echo "Claude Code 未安装"
fi

echo ""
echo "4. 检查 npm 全局包..."
npm list -g @anthropic-ai/claude-code 2>/dev/null || echo "未找到 npm 全局包"

echo ""
echo "5. 检查 Homebrew 包（macOS）..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew list | grep claude-code 2>/dev/null || echo "未找到 Homebrew 包"
else
    echo "非 macOS 系统，跳过 Homebrew 检查"
fi

echo ""
echo "6. 检查配置文件..."
if [ -f "$HOME/.claude/settings.json" ]; then
    echo "配置文件存在: $HOME/.claude/settings.json"
else
    echo "配置文件不存在"
fi

echo ""
echo "测试完成！"