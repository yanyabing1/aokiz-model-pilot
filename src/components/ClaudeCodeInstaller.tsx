'use client'

import { useState, useEffect } from 'react'
import { Card, Button, Space, Progress, Alert, Typography, Steps, Tag, Divider, message } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  LoadingOutlined,
  DownloadOutlined,
  ApiOutlined,
  GithubOutlined,
  GlobalOutlined
} from '@ant-design/icons'

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

export default function ClaudeCodeInstaller() {
  const [status, setStatus] = useState<InstallStatus>({ installed: false })
  const [loading, setLoading] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStep, setInstallStep] = useState(0)
  const [installResult, setInstallResult] = useState<InstallResult | null>(null)

  // 检查安装状态
  const checkInstallStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/claude-install')
      const data: InstallStatus = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to check Claude Code status:', error)
      setStatus({ 
        installed: false, 
        error: 'Failed to check installation status' 
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
      'Preparing installation...',
      'Downloading Claude Code...',
      'Installing dependencies...',
      'Configuring environment...',
      'Verifying installation...'
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
        message.success('Claude Code installed successfully!')
        // 重新检查状态
        await checkInstallStatus()
      } else {
        message.error(`Installation failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Installation failed:', error)
      setInstallResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      message.error('Installation failed')
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
        return 'Unknown'
    }
  }

  if (loading) {
    return (
      <Card loading>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <LoadingOutlined style={{ fontSize: 24 }} />
          <p>Checking Claude Code installation status...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      title={
        <Space>
          <DownloadOutlined />
          Claude Code Installation
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      {/* 安装状态 */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {status.installed ? (
              <>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                <Text strong style={{ color: '#52c41a' }}>
                  Claude Code is installed
                </Text>
                <Tag color="success" icon={getInstallMethodIcon(status.installMethod || '')}>
                  {getInstallMethodName(status.installMethod || '')}
                </Tag>
                {status.version && (
                  <Tag color="blue">v{status.version}</Tag>
                )}
              </>
            ) : (
              <>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                <Text strong style={{ color: '#ff4d4f' }}>
                  Claude Code is not installed
                </Text>
              </>
            )}
          </div>

          {status.path && (
            <Text type="secondary">
              Installation path: {status.path}
            </Text>
          )}

          {status.error && (
            <Alert
              message="Error"
              description={status.error}
              type="error"
              showIcon
            />
          )}
        </Space>
      </div>

      <Divider />

      {/* 安装选项 */}
      {!status.installed && (
        <div>
          <Title level={5}>Choose Installation Method</Title>
          
          <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
            <Alert
              message="Recommendation"
              description="We recommend using npm for installation as it's the most reliable method across all platforms."
              type="info"
              showIcon
            />

            <Space wrap>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={installing}
                onClick={() => installClaudeCode('npm')}
                disabled={installing}
              >
                Install with npm (Recommended)
              </Button>

              {process.platform === 'darwin' && (
                <Button
                  icon={<ApiOutlined />}
                  loading={installing}
                  onClick={() => installClaudeCode('brew')}
                  disabled={installing}
                >
                  Install with Homebrew
                </Button>
              )}

              <Button
                icon={<GlobalOutlined />}
                loading={installing}
                onClick={() => installClaudeCode('curl')}
                disabled={installing}
              >
                Install with curl
              </Button>
            </Space>
          </Space>
        </div>
      )}

      {/* 安装进度 */}
      {installing && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Installation Progress</Title>
          <Steps
            current={installStep}
            direction="vertical"
            size="small"
            items={[
              { title: 'Preparing installation...' },
              { title: 'Downloading Claude Code...' },
              { title: 'Installing dependencies...' },
              { title: 'Configuring environment...' },
              { title: 'Verifying installation...' },
            ]}
          />
          <Progress percent={installProgress} style={{ marginTop: 16 }} />
        </div>
      )}

      {/* 安装结果 */}
      {installResult && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Installation Result</Title>
          {installResult.success ? (
            <Alert
              message="Success"
              description={installResult.message}
              type="success"
              showIcon
            />
          ) : (
            <Alert
              message="Failed"
              description={installResult.error}
              type="error"
              showIcon
            />
          )}
        </div>
      )}

      {/* 已安装时的操作 */}
      {status.installed && (
        <div style={{ marginTop: 24 }}>
          <Space>
            <Button onClick={checkInstallStatus} loading={loading}>
              Refresh Status
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => installClaudeCode('npm')}
            >
              Reinstall
            </Button>
          </Space>
        </div>
      )}

      {/* 系统要求 */}
      <Divider />
      <div>
        <Title level={5}>System Requirements</Title>
        <ul>
          <li>Node.js 18.0 or higher</li>
          <li>npm 8.0 or higher</li>
          <li>Anthropic API key</li>
          <li>Internet connection for download</li>
        </ul>
      </div>
    </Card>
  )
}