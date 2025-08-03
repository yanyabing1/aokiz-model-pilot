'use client'

import {
  CheckCircleOutlined,
  CodeOutlined,
  CopyOutlined,
  DownloadOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { Alert, Button, Card, Col, Divider, List, Row, Space, Steps, Tabs, Tag, Typography, message } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

interface InstallationGuideProps {
  onInstallationComplete?: () => void
}

export default function InstallationGuide({ onInstallationComplete }: InstallationGuideProps) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

  const installationMethods = [
    {
      key: 'npm',
      name: 'npm 安装',
      icon: <DownloadOutlined />,
      commands: [
        'npm install -g @anthropic-ai/claude-code'
      ],
      description: '推荐方式，跨平台支持',
      verification: 'claude --version'
    },
    {
      key: 'brew',
      name: 'Homebrew 安装',
      icon: <CodeOutlined />,
      commands: [
        'brew install anthropic/tap/claude-code'
      ],
      description: 'macOS 用户推荐',
      platform: 'macOS',
      verification: 'claude --version'
    },
    {
      key: 'curl',
      name: '官方脚本安装',
      icon: <FileTextOutlined />,
      commands: [
        'curl -fsSL https://claude.ai/install | sh'
      ],
      description: '官方安装脚本',
      verification: 'claude --version'
    }
  ]

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCommand(type)
      message.success('命令已复制到剪贴板')
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (_error) {
      message.error('复制失败，请手动复制')
    }
  }

  const systemRequirements = [
    {
      title: 'Node.js',
      version: '18.0+',
      check: 'node --version',
      icon: <CodeOutlined style={{ color: '#52c41a' }} />,
      critical: true
    },
    {
      title: 'npm',
      version: '8.0+',
      check: 'npm --version',
      icon: <DownloadOutlined style={{ color: '#1890ff' }} />,
      critical: true
    },
    {
      title: '网络连接',
      version: '稳定连接',
      check: 'ping claude.ai',
      icon: <SafetyCertificateOutlined style={{ color: '#722ed1' }} />,
      critical: false
    }
  ]

  const securitySteps = [
    {
      title: '下载验证',
      description: '确保从官方源下载 Claude Code',
      icon: <SafetyCertificateOutlined />
    },
    {
      title: '权限确认',
      description: '安装时可能需要管理员权限',
      icon: <UserOutlined />
    },
    {
      title: '环境配置',
      description: '配置 PATH 环境变量',
      icon: <CodeOutlined />
    },
    {
      title: 'API 密钥',
      description: '配置 Anthropic API 密钥',
      icon: <FileTextOutlined />
    }
  ]

  const renderCommandBlock = (commands: string[], method: string) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
      {commands.map((command, index) => (
        <div key={index} className={index < commands.length - 1 ? 'mb-3' : ''}>
          <div className="flex items-center justify-between gap-3">
            <code className="bg-white border border-gray-300 rounded-md px-3 py-2 font-mono text-sm text-gray-800 flex-1 overflow-x-auto">
              {command}
            </code>
            <Button
              type="text"
              icon={copiedCommand === `${method}-${index}` ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={() => copyToClipboard(command, `${method}-${index}`)}
              size="small"
              className="text-gray-600 hover:text-blue-600"
            >
              {copiedCommand === `${method}-${index}` ? '已复制' : '复制'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  const tabItems = [
    {
      key: 'install',
      label: '安装指南',
      children: (
        <div>
          <Alert
            message="安全提示"
            description="Claude Code 需要在您的本地环境中安装运行。此网页应用仅提供安装指导，不会直接访问您的电脑系统。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Title level={4}>选择安装方式</Title>
          
          <Row gutter={[16, 16]}>
            {installationMethods.map((method) => (
              <Col xs={24} lg={8} key={method.key}>
                <Card
                  title={
                    <Space>
                      {method.icon}
                      {method.name}
                      {method.platform && <Tag color="orange">{method.platform}</Tag>}
                    </Space>
                  }
                  style={{ height: '100%' }}
                >
                  <Paragraph code>{method.description}</Paragraph>
                  
                  {renderCommandBlock(method.commands, method.key)}
                  
                  <Divider />
                  
                  <div>
                    <Text strong>验证安装：</Text>
                    <div style={{ marginTop: 8 }}>
                      <code style={{ 
                        background: '#f0f0f0', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px'

                      }}
                        className='text-gray-800'
                      >
                        {method.verification}
                      </code>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )
    },
    {
      key: 'requirements',
      label: '系统要求',
      children: (
        <div>
          <Title level={4}>系统要求检查</Title>
          
          <List
            dataSource={systemRequirements}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon}
                  title={
                    <Space>
                      <Text strong>{item.title}</Text>
                      <Tag color={item.critical ? 'red' : 'blue'}>
                        {item.critical ? '必需' : '推荐'}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Text type="secondary">版本要求: {item.version}</Text>
                      <div style={{ marginTop: 4 }}>
                        <Text>检查命令: </Text>
                        <code style={{ 
                          background: '#f0f0f0', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                        className='text-gray-800'
                        >
                          {item.check}
                        </code>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )
    },
    {
      key: 'security',
      label: '安全说明',
      children: (
        <div>
          <Title level={4}>安装安全说明</Title>
          
          <Alert
            message="重要安全提示"
            description="Claude Code 是一个命令行工具，安装后可以在您的终端中运行。请确保从官方渠道下载，并注意保护您的 API 密钥。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Steps
            direction="vertical"
            current={0}
            items={securitySteps.map(step => ({
              title: step.title,
              description: step.description,
              icon: step.icon
            }))}
          />

          <Divider />

          <Title level={5}>权限说明</Title>
          <Paragraph>
            Claude Code 可能需要以下权限：
          </Paragraph>
          <ul>
            <li>网络访问权限 - 用于与 Anthropic API 通信</li>
            <li>文件系统访问权限 - 用于读取和写入项目文件</li>
            <li>终端执行权限 - 用于运行命令和脚本</li>
          </ul>

          <Alert
            message="隐私保护"
            description="您的代码和敏感信息不会被上传到外部服务器（除非明确要求）。所有处理都在本地进行。"
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        </div>
      )
    },
    {
      key: 'troubleshooting',
      label: '故障排除',
      children: (
        <div>
          <Title level={4}>常见问题解决</Title>
          
          <List
            dataSource={[
              {
                title: '命令未找到',
                solution: '确保已将 Claude Code 添加到 PATH 环境变量中',
                command: 'export PATH="$PATH:/usr/local/bin"'
              },
              {
                title: '权限不足',
                solution: '使用 sudo 运行安装命令',
                command: 'sudo npm install -g @anthropic-ai/claude-code'
              },
              {
                title: '网络连接问题',
                solution: '检查网络连接和代理设置',
                command: 'ping claude.ai'
              },
              {
                title: 'API 密钥配置',
                solution: '设置 Anthropic API 密钥',
                command: 'export ANTHROPIC_API_KEY=your_api_key_here'
              }
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<WarningOutlined style={{ color: '#faad14' }} />}
                  title={item.title}
                  description={
                    <div>
                      <Paragraph>{item.solution}</Paragraph>
                      {item.command && (
                        <div style={{ marginTop: 8 }}>
                          <Text>命令: </Text>
                          <code style={{ 
                            background: '#f0f0f0', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          className='text-gray-800'
                          >
                            {item.command}
                          </code>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )
    }
  ]

  return (
    <Card title="Claude Code 安装指南">
      <Tabs 
        items={tabItems}
        type="card"
        style={{ marginTop: 16 }}
      />
      
      <Divider />
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Space direction="vertical" size="middle">
          <Text strong>安装完成后，请返回主页面进行配置</Text>
          <Button 
            type="primary" 
            onClick={onInstallationComplete}
            icon={<CheckCircleOutlined />}
          >
            我已完成安装
          </Button>
        </Space>
      </div>
    </Card>
  )
}