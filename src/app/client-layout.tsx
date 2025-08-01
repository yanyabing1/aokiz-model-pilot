'use client';

import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#165DFF',
          colorBgContainer: '#1a1b23',
          colorBgElevated: '#262731',
          colorBgLayout: '#11111a',
          colorText: '#e5e7eb',
          colorTextSecondary: '#9ca3af',
          colorBorder: '#374151',
          borderRadius: 8,
        },
        components: {
          Message: {
            contentBg: '#262731',
            colorText: '#e5e7eb',
          },
          Modal: {
            contentBg: '#1a1b23',
            headerBg: '#1a1b23',
          },
          Notification: {
            colorBgElevated: '#262731',
            colorText: '#e5e7eb',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}