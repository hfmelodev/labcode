import { Geist, Geist_Mono } from 'next/font/google'

import '../styles/globals.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { cn } from '@/lib/utils'

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
