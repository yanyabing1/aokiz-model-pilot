'use client'

import {
  ApiOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  GithubOutlined,
  GlobalOutlined,
  LoadingOutlined,
  GlobalOutlined as NetworkOutlined,
  NodeIndexOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  List,
  Progress,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd'
import { useEffect, useState } from 'react'

const { Title, Text } = Typography

interface InstallStatus {
  installed: boolean
  version?: string
  installMethod?: string
  path?: string
  configExists?: boolean
  error?: string
  message?: string
}

interface InstallResult {
  success: boolean
  version?: string
  installMethod?: string
  message?: string
  error?: string
}

interface ClaudeCodeInstallerProps {
  installSuccessTrigger?: number
}

export default function ClaudeCodeInstaller({ installSuccessTrigger = 0 }: ClaudeCodeInstallerProps) {
  const [status, setStatus] = useState<InstallStatus>({ installed: false })
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStep, setInstallStep] = useState(0)
  const [installResult, setInstallResult] = useState<InstallResult | null>(null)

  // 检查安装状态
  const checkInstallStatus = async (retryCount = 0) => {
    setLoading(true)
    try {
      const response = await fetch('/api/claude-install')
      const data: InstallStatus = await response.json()
      setStatus(data)
      
      // 如果安装成功但没有版本信息，重试一次
      if (data.installed && !data.version && retryCount < 2) {
        console.log('Installation detected but no version info, retrying...')
        setTimeout(() => checkInstallStatus(retryCount + 1), 1000)
      }
    } catch (error) {
      console.error('检查 Claude Code 状态失败:', error)
      setStatus({
        installed: false,
        error: '检查安装状态失败',
      })
    } finally {
      setLoading(false)
    }
  }

  // 自动安装 Claude Code
  const installClaudeCode = async (method: 'npm' | 'brew' | 'curl') => {
    setInstalling(true)
    setInstallProgress(0)
    setInstallStep(0)
    setInstallResult(null)

    const steps = [
      '准备安装环境...',
      '下载 Claude Code...',
      '安装依赖包...',
      '配置环境变量...',
      '验证安装结果...',
    ]

    try {
      // 模拟安装进度
      for (let i = 0; i < steps.length; i++) {
        setInstallStep(i)
        setInstallProgress((i + 1) * 20)

        // 模拟每个步骤的延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const response = await fetch('/api/claude-install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      })

      const result: InstallResult = await response.json()
      setInstallResult(result)

      if (result.success) {
        message.success('Claude Code 安装成功！正在验证安装...')
        // 延迟后重新检查状态，确保环境变量和路径已更新
        setTimeout(async () => {
          await checkInstallStatus()
        }, 2000) // 2秒延迟
      } else {
        message.error(`安装失败: ${result.error}`)
      }
    } catch (error) {
      console.error('安装失败:', error)
      setInstallResult({
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      })
      message.error('安装失败')
    } finally {
      setInstalling(false)
      setInstallProgress(0)
      setInstallStep(0)
    }
  }

  // 组件加载时检查状态
  useEffect(() => {
    checkInstallStatus()
  }, [])

  // 监听安装成功触发器
  useEffect(() => {
    if (installSuccessTrigger > 0) {
      console.log('Install success trigger detected, refreshing status...')
      // 延迟一下确保系统有足够时间更新
      setTimeout(() => {
        checkInstallStatus()
      }, 1000)
    }
  }, [installSuccessTrigger])

  const getInstallMethodIcon = (method: string) => {
    switch (method) {
      case 'npm':
        return <DownloadOutlined />
      case 'brew':
        return <ApiOutlined />
      case 'curl':
        return <GlobalOutlined />
      default:
        return <GithubOutlined />
    }
  }

  const getInstallMethodName = (method: string) => {
    switch (method) {
      case 'npm':
        return 'npm'
      case 'brew':
        return 'Homebrew'
      case 'curl':
        return 'curl'
      default:
        return '未知'
    }
  }

  if (loading) {
    return (
      <Card loading>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <LoadingOutlined style={{ fontSize: 24 }} />
          <p>正在检查 Claude Code 安装状态...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      title={
        <Space>
          <DownloadOutlined />
          Claude Code 安装管理
        </Space>
      }
      className="claude-installer-card"
    >
      {/* 安装状态 */}
      <div className="status-section" style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {status.installed ? (
                  <>
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                    <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                      Claude Code 已安装
                    </Text>
                    <Tag color="success" icon={getInstallMethodIcon(status.installMethod || '')}>
                      {getInstallMethodName(status.installMethod || '')}
                    </Tag>
                    {status.version && <Tag color="blue">v{status.version}</Tag>}
                  </>
                ) : (
                  <>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                    <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
                      Claude Code 未安装
                    </Text>
                  </>
                )}
              </div>

              {status.path && (
                <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                  <strong>安装路径:</strong> {status.path}
                </Text>
              )}

              {status.error && (
                <Alert
                  message="错误"
                  description={status.error}
                  type="error"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              )}
            </Space>
          </Col>

          {/* 已安装时的操作按钮 */}
          {status.installed && (
            <Col xs={24} lg={8}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  gap: '12px',
                  padding: '0 12px',
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={() => installClaudeCode('npm')}
                  loading={installing}
                  className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  重新安装
                </Button>
                <Button
                  type="default"
                  size="large"
                  onClick={() => checkInstallStatus()}
                  loading={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-500 border border-blue-400/40 rounded-lg shadow hover:from-blue-500/20 hover:to-blue-600/20 hover:text-blue-600 hover:border-blue-500 transition-all duration-200 flex items-center justify-center font-medium hover:shadow-glow-lg transition-all duration-300 transform hover:-translate-y-1 "
                  style={{
                    fontSize: '16px',
                    height: '44px',
                  }}
                  icon={<i className="fas fa-sync-alt" style={{ marginRight: 6 }} />}
                >
                  刷新状态
                </Button>
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Divider />

      {/* 安装选项 */}
      {!status.installed && (
        <div className="install-section" style={{ marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            选择安装方式
          </Title>

          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="推荐方式"
              description="我们推荐使用 npm 进行安装，因为它是跨所有平台最可靠的方法。"
              type="info"
              showIcon
            />

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  loading={installing}
                  onClick={() => installClaudeCode('npm')}
                  disabled={installing}
                  size="large"
                  style={{ width: '100%', height: 'auto', padding: '12px 16px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div>使用 npm 安装</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>（推荐）</div>
                  </div>
                </Button>
              </Col>

              {process.platform === 'darwin' && (
                <Col xs={24} sm={12} lg={8}>
                  <Button
                    icon={<ApiOutlined />}
                    loading={installing}
                    onClick={() => installClaudeCode('brew')}
                    disabled={installing}
                    size="large"
                    style={{ width: '100%', height: 'auto', padding: '12px 16px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div>使用 Homebrew 安装</div>
                      <div style={{ fontSize: '12px', opacity: 0.6 }}>macOS 专用</div>
                    </div>
                  </Button>
                </Col>
              )}

              <Col xs={24} sm={12} lg={8}>
                <Button
                  icon={<GlobalOutlined />}
                  loading={installing}
                  onClick={() => installClaudeCode('curl')}
                  disabled={installing}
                  size="large"
                  style={{ width: '100%', height: 'auto', padding: '12px 16px' }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div>使用 curl 安装</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>直接下载</div>
                  </div>
                </Button>
              </Col>
            </Row>
          </Space>
        </div>
      )}

      {/* 安装进度 */}
      {installing && (
        <div className="progress-section" style={{ marginTop: 32, marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            安装进度
          </Title>
          <Row gutter={[24, 16]}>
            <Col xs={24} lg={12}>
              <Steps
                current={installStep}
                direction="vertical"
                size="small"
                items={[
                  { title: '准备安装环境...' },
                  { title: '下载 Claude Code...' },
                  { title: '安装依赖包...' },
                  { title: '配置环境变量...' },
                  { title: '验证安装结果...' },
                ]}
              />
            </Col>
            <Col xs={24} lg={12}>
              <div style={{ padding: '20px 0' }}>
                <Progress
                  percent={installProgress}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  style={{ marginBottom: 16 }}
                />
                <Text type="secondary">正在执行安装步骤，请耐心等待...</Text>
              </div>
            </Col>
          </Row>
        </div>
      )}

      {/* 安装结果 */}
      {installResult && (
        <div className="result-section" style={{ marginTop: 32, marginBottom: 32 }}>
          <Title level={4} style={{ marginBottom: 16 }}>
            安装结果
          </Title>
          {installResult.success ? (
            <Alert
              message="安装成功"
              description={
                <div>
                  <p>{installResult.message}</p>
                  {loading && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LoadingOutlined />
                      <span>正在验证安装状态...</span>
                    </div>
                  )}
                </div>
              }
              type="success"
              showIcon
              style={{ borderRadius: 8 }}
            />
          ) : (
            <Alert
              message="安装失败"
              description={installResult.error}
              type="error"
              showIcon
              style={{ borderRadius: 8 }}
            />
          )}
        </div>
      )}

      {/* 系统要求 */}
      <Divider />
      <div className="requirements-section" style={{ marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          系统要求
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <List
              size="large"
              dataSource={[
                {
                  icon: <NodeIndexOutlined style={{ color: '#52c41a' }} />,
                  title: 'Node.js 18.0 或更高版本',
                  description: '用于运行 Claude Code 的基础环境',
                },
                {
                  icon: <DownloadOutlined style={{ color: '#1890ff' }} />,
                  title: 'npm 8.0 或更高版本',
                  description: '包管理器，用于安装和管理依赖',
                },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={<Text strong>{item.title}</Text>}
                    description={<Text type="secondary">{item.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Col>
          <Col xs={24} lg={12}>
            <List
              size="large"
              dataSource={[
                {
                  icon: <SafetyCertificateOutlined style={{ color: '#722ed1' }} />,
                  title: 'Anthropic API 密钥',
                  description: '用于访问 Claude AI 服务的认证凭据',
                },
                {
                  icon: <NetworkOutlined style={{ color: '#13c2c2' }} />,
                  title: '网络连接',
                  description: '用于下载安装包和访问 API 服务',
                },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.icon}
                    title={<Text strong>{item.title}</Text>}
                    description={<Text type="secondary">{item.description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>
    </Card>
  )
}
