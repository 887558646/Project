import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '面試練習平台',
  description: '資管系面試練習平台',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
