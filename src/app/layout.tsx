import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientLayout from './client-layout'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Claude Configuration Manager',
  description: 'Manage Claude AI global configuration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet"/>
      </head>
      <body className={inter.className}>
        <ClientLayout>
          <main className="min-h-screen overflow-y-auto">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  )
}