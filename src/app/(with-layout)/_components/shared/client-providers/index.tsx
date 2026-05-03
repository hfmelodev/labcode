'use client'

import { ptBR } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryClientProvider } from '@tanstack/react-query'
import { setDefaultOptions } from 'date-fns'
import { ptBR as ptBRDateFns } from 'date-fns/locale/pt-BR'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { queryClient } from '@/lib/tanstack-query'

type ClientProvidersProps = {
  children: React.ReactNode
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme()

  return <Toaster position="bottom-right" richColors closeButton theme={resolvedTheme as 'light' | 'dark' | 'system'} />
}

export function ClientProviders({ children }: ClientProvidersProps) {
  useEffect(() => {
    setDefaultOptions({ locale: ptBRDateFns })
  }, [])

  return (
    <ClerkProvider localization={ptBR}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <ThemedToaster />
      </ThemeProvider>
    </ClerkProvider>
  )
}
