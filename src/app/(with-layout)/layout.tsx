'use client'

import { useUser } from '@clerk/nextjs'
import { LogIn } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/shared/app-sidebar'
import { SearchInput } from './_components/shared/search-input'

export default function WithLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-20 shrink-0 items-center justify-between gap-2 border-b px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <Suspense>
              <SearchInput />
            </Suspense>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />

            {!user && (
              <Link href="/auth/sign-in" className="flex items-center gap-2">
                <Button size="sm">
                  <LogIn /> Entrar
                </Button>
              </Link>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
