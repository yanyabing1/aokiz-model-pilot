'use client'

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { Alert, Card, Col, Row, Space, Typography, Steps, Tag, Divider, List } from 'antd'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

interface SecurityInfoProps {
  onSecurityConfirmed?: () => void
}

export default function SecurityInfo({ onSecurityConfirmed }: SecurityInfoProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const securityPrinciples = [
    {
      title: '本地优先',
      description: 'Claude Code 在您的本地环境中运行，不会将您的代码上传到外部服务器',
      icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: '权限控制',
      description: '您可以精确控制 Claude Code 可以访问的文件和执行的命令',
      icon: <UserOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: '透明操作',
      description: '所有操作都会在终端中显示，您可以清楚地看到正在执行什么',
      icon: <InfoCircleOutlined style={{ color: '#722ed1' }} />
    },
    {
      title: '安全配置',
      description: '默认启用安全限制，防止意外执行危险操作',
      icon: <CheckCircleOutlined style={{ color: '#13c2c2' }} />
    }
  ]

  const permissionLevels = [
    {
      level: '安全模式',
      description: '只允许读取和编辑特定的项目文件',
      color: 'green',
      permissions: [
        '读取 src/ 目录中的文件',
        '编辑 src/ 目录中的文件',
        '运行 git 命令',
        '运行 npm 命令'
      ]
    },
    {
      level: '标准模式',
      description: '允许更广泛的文件访问和基本的系统命令',
      color: 'blue',
      permissions: [
        '访问项目所有文件',
        '运行基本的系统命令',
        '使用文件搜索工具',
        '管理任务列表'
      ]
    },
    {
      level: '专家模式',
      description: '允许执行更强大的系统命令和脚本',
      color: 'orange',
      permissions: [
        '执行任意的 bash 命令',
        '访问系统级文件',
        '网络请求',
        '完全的系统访问'
      ]
    }
  ]

  const securityTips = [
    {
      title: '保护 API 密钥',
      description: '妥善保管您的 Anthropic API 密钥，不要在代码中硬编码',
      icon: <WarningOutlined style={{ color: '#faad14' }} />
    },
    {
      title: '定期检查权限',
      description: '定期审查 Claude Code 的权限设置，确保符合您的需求',
      icon: <SafetyCertificateOutlined style={{ color: '#52c41a' }} />
    },
    {
      title: '备份重要文件',
      description: '在使用 Claude Code 进行大规模修改前，建议备份重要文件',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />
    },
    {
      title: '监控输出',
      description: '留意 Claude Code 的输出，特别是执行系统命令时的反馈',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
    }
  ]

  return (
    <div>
      <Card title="安全与权限说明" style={{ marginBottom: 24 }}>
        <Alert
          message="重要提醒"
          description="Claude Code 是一个强大的 AI 编程助手，需要在您的本地环境中运行。请了解以下安全信息以确保安全使用。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Title level={4}>安全原则</Title>
        <Steps
          direction="vertical"
          current={currentStep}
          items={securityPrinciples.map(principle => ({
            title: principle.title,
            description: principle.description,
            icon: principle.icon
          }))}
          style={{ marginBottom: 32 }}
        />

        <Divider />

        <Title level={4}>权限级别说明</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          {permissionLevels.map((level, index) => (
            <Col xs={24} lg={8} key={index}>
              <Card 
                title={
                  <Space>
                    <Tag color={level.color}>{level.level}</Tag>
                  </Space>
                }
                style={{ height: '100%' }}
              >
                <Paragraph type="secondary">{level.description}</Paragraph>
                <List
                  size="small"
                  dataSource={level.permissions}
                  renderItem={item => (
                    <List.Item>
                      <Text style={{ fontSize: '12px' }}>• {item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Title level={4}>安全使用建议</Title>
        <List
          dataSource={securityTips}
          renderItem={tip => (
            <List.Item>
              <List.Item.Meta
                avatar={tip.icon}
                title={tip.title}
                description={tip.description}
              />
            </List.Item>
          )}
          style={{ marginBottom: 32 }}
        />

        <Divider />

        <Title level={4}>隐私保护</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="数据隐私" size="small">
              <List size="small">
                <List.Item>
                  <Text strong>本地处理：</Text>
                  <Text>代码分析和处理在本地进行</Text>
                </List.Item>
                <List.Item>
                  <Text strong>API 通信：</Text>
                  <Text>仅与 Anthropic API 通信获取 AI 响应</Text>
                </List.Item>
                <List.Item>
                  <Text strong>无数据收集：</Text>
                  <Text>不会收集您的个人信息或代码</Text>
                </List.Item>
              </List>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="使用限制" size="small">
              <List size="small">
                <List.Item>
                  <Text strong>文件访问：</Text>
                  <Text>仅限配置允许的目录</Text>
                </List.Item>
                <List.Item>
                  <Text strong>网络访问：</Text>
                  <Text>仅允许必要的 API 调用</Text>
                </List.Item>
                <List.Item>
                  <Text strong>系统命令：</Text>
                  <Text>需要明确的权限配置</Text>
                </List.Item>
              </List>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Alert
          message="用户责任"
          description="作为用户，您需要负责：
          • 妥善保管 API 密钥和敏感信息
          • 定期审查权限设置
          • 备份重要文件
          • 监控 Claude Code 的操作
          • 遵守相关法律法规"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space direction="vertical" size="middle">
            <Text strong>已了解安全信息，可以开始使用</Text>
            <Alert
              message="请确认您已阅读并理解以上安全信息"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          </Space>
        </div>
      </Card>
    </div>
  )
}