'use client'

import { useState, useEffect } from 'react'
import { Modal, Button, Space, Progress, Alert, Typography, Steps, Tag, Divider, message, Card } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  DownloadOutlined,
  ApiOutlined,
  GithubOutlined,
  GlobalOutlined,
  CloseOutlined,
  SettingOutlined
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

interface ClaudeInstallModalProps {
  visible: boolean
  onClose: () => void
  onInstallSuccess: () => void
  installStatus: InstallStatus | null
}

export default function ClaudeInstallModal({ 
  visible, 
  onClose, 
  onInstallSuccess, 
  installStatus 
}: ClaudeInstallModalProps) {
  const [installing, setInstalling] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [installStep, setInstallStep] = useState(0)
  const [installResult, setInstallResult] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState<'npm' | 'brew' | 'curl'>('npm')

  // 自动安装 Claude Code
  const installClaudeCode = async (method: 'npm' | 'brew' | 'curl') => {
    setInstalling(true)
    setInstallProgress(0)
    setInstallStep(0)
    setInstallResult(null)
    setSelectedMethod(method)

    const steps = [
      '准备安装环境...',
      '下载 Claude Code...',
      '安装依赖包...',
      '配置环境变量...',
      '验证安装结果...'
    ]

    try {
      // 模拟安装进度
      for (let i = 0; i < steps.length; i++) {
        setInstallStep(i)
        setInstallProgress((i + 1) * 20)
        
        // 模拟每个步骤的延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      const response = await fetch('/api/claude-install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method }),
      })

      const result = await response.json()
      setInstallResult(result)

      if (result.success) {
        message.success('Claude Code 安装成功！')
        setTimeout(() => {
          onInstallSuccess()
        }, 2000)
      } else {
        message.error(`安装失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Installation failed:', error)
      setInstallResult({
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
      message.error('安装失败')
    } finally {
      setInstalling(false)
      setInstallProgress(0)
      setInstallStep(0)
    }
  }

  // 重置状态当弹窗关闭时
  useEffect(() => {
    if (!visible) {
      setInstalling(false)
      setInstallProgress(0)
      setInstallStep(0)
      setInstallResult(null)
    }
  }, [visible])

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

  const installMethods = [
    {
      key: 'npm',
      name: 'npm 安装',
      description: '推荐方式，跨平台支持',
      icon: <DownloadOutlined />,
      recommended: true
    },
    {
      key: 'brew',
      name: 'Homebrew 安装',
      description: 'macOS 用户推荐',
      icon: <ApiOutlined />,
      platform: 'macOS'
    },
    {
      key: 'curl',
      name: 'curl 安装',
      description: '官方安装脚本',
      icon: <GlobalOutlined />
    }
  ]

  return (
    <Modal
      title={
        <Space>
          <DownloadOutlined />
          Claude Code 安装引导
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closeIcon={<CloseOutlined />}
      maskClosable={!installing}
      closable={!installing}
    >
      {/* 当前状态 */}
      <div style={{ marginBottom: 24 }}>
        {installStatus && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {installStatus.installed ? (
              <>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                <Text strong style={{ color: '#52c41a' }}>
                  Claude Code 已安装
                </Text>
                {installStatus.version && (
                  <Tag color="success">v{installStatus.version}</Tag>
                )}
                {installStatus.installMethod && (
                  <Tag color="blue" icon={getInstallMethodIcon(installStatus.installMethod)}>
                    {getInstallMethodName(installStatus.installMethod)}
                  </Tag>
                )}
              </>
            ) : (
              <>
                <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />
                <Text strong style={{ color: '#ff4d4f' }}>
                  Claude Code 未安装
                </Text>
              </>
            )}
          </div>
        )}

        {installStatus?.error && (
          <Alert
            message="检测错误"
            description={installStatus.error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
      </div>

      <Divider />

      {/* 安装引导 */}
      {!installStatus?.installed && !installing && !installResult?.success && (
        <div>
          <Title level={5}>选择安装方式</Title>
          
          <Alert
            message="推荐使用 npm 方式安装"
            description="npm 安装方式最为稳定，支持所有主流操作系统。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
            {installMethods.map(method => (
              <Card 
                key={method.key}
                hoverable
                className={`install-method-card ${method.recommended ? 'recommended' : ''}`}
                onClick={() => !installing && installClaudeCode(method.key as any)}
                style={{ 
                  cursor: installing ? 'not-allowed' : 'pointer',
                  opacity: installing ? 0.6 : 1,
                  border: method.recommended ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Space>
                    <div style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 8, 
                      background: 'rgba(24, 144, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      color: '#1890ff'
                    }}>
                      {method.icon}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text strong>{method.name}</Text>
                        {method.recommended && <Tag color="blue">推荐</Tag>}
                        {method.platform && <Tag color="orange">{method.platform}</Tag>}
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {method.description}
                      </Text>
                    </div>
                  </Space>
                  <Button type="primary" loading={installing && selectedMethod === method.key}>
                    {installing && selectedMethod === method.key ? '安装中...' : '立即安装'}
                  </Button>
                </div>
              </Card>
            ))}
          </Space>
        </div>
      )}

      {/* 安装进度 */}
      {installing && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>安装进度</Title>
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
          <Progress percent={installProgress} style={{ marginTop: 16 }} />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
            正在通过 {getInstallMethodName(selectedMethod)} 安装 Claude Code...
          </Text>
        </div>
      )}

      {/* 安装结果 */}
      {installResult && (
        <div style={{ marginTop: 24 }}>
          <Title level={5}>安装结果</Title>
          {installResult.success ? (
            <Alert
              message="安装成功"
              description={
                <div>
                  <p>Claude Code 已成功安装！</p>
                  {installResult.version && <p>版本: {installResult.version}</p>}
                  {installResult.installMethod && <p>安装方式: {getInstallMethodName(installResult.installMethod)}</p>}
                </div>
              }
              type="success"
              showIcon
            />
          ) : (
            <Alert
              message="安装失败"
              description={installResult.error}
              type="error"
              showIcon
              action={
                <Button size="small" danger onClick={() => setInstallResult(null)}>
                  重试
                </Button>
              }
            />
          )}
        </div>
      )}

      {/* 系统要求 */}
      <Divider />
      <div>
        <Title level={5}>系统要求</Title>
        <ul style={{ marginBottom: 16 }}>
          <li>Node.js 18.0 或更高版本</li>
          <li>npm 8.0 或更高版本</li>
          <li>Anthropic API 密钥</li>
          <li>网络连接（用于下载）</li>
        </ul>
      </div>

      {/* 底部操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <Button onClick={onClose} disabled={installing}>
          {installStatus?.installed ? '完成' : '稍后安装'}
        </Button>
        
        {installStatus?.installed && (
          <Space>
            <Button icon={<SettingOutlined />} onClick={onClose}>
              开始配置
            </Button>
          </Space>
        )}
      </div>
    </Modal>
  )
}