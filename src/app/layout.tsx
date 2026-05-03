import { Geist, Geist_Mono } from 'next/font/google'

import '../styles/globals.css'

import { setDefaultOptions } from 'date-fns'
import { ptBR as ptBRDateFns } from 'date-fns/locale/pt-BR'
import { cn } from '@/lib/utils'
import { ClientProviders } from './(with-layout)/_components/shared/client-providers'

setDefaultOptions({ locale: ptBRDateFns })

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'LabCode',
  description: 'Desenvolvimento e Software',
  icons: {
    icon: '/labcode-icon.svg',
    link: '/labcode-icon.svg',
    'apple-touch-icon': '/labcode-icon.svg',
    'apple-touch-icon-precomposed': '/labcode-icon.svg',
  },
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
