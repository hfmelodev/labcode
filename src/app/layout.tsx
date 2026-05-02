import { Geist, Geist_Mono } from 'next/font/google'

import '../styles/globals.css'

import { cn } from '@/lib/utils'
import { ClientProviders } from './(with-layout)/_components/shared/client-providers'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'LabCode',
  description: 'Desenvolvimento e Software',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn('font-mono antialiased', fontSans.variable, geistMono.variable)}>
      <head />
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
