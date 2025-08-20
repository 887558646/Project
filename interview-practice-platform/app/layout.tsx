import type { Metadata } from 'next'
import './globals.css'
import { Noto_Sans_TC } from 'next/font/google'

export const metadata: Metadata = {
  title: '面試練習平台',
  description: '資管系面試練習平台',
  generator: 'Next.js',
}

const notoSans = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
