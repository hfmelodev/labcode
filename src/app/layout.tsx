import { Geist, Geist_Mono } from 'next/font/google'

import '../styles/globals.css'
import { cn } from '@/lib/utils'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('antialiased', fontSans.variable, 'font-mono', geistMono.variable)}>
      <body>{children}</body>
    </html>
  )
}
