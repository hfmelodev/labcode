import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

type AppSidebarProps = ComponentProps<typeof Sidebar>

import Logo from '@/assets/labcode.svg'
import LogoIcon from '@/assets/labcode-icon.svg'
import { NavItems } from './nav-items'
import { NavUser } from './nav-user'

export function AppSidebar({ ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-4">
        <Link href="/" className="block">
          <Logo className="mx-auto w-full max-w-44 group-data-[state=expanded]:block sm:hidden" />
          <LogoIcon className="mx-auto -ml-1 hidden size-10 pt-1.5 group-data-[state=collapsed]:block" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavItems />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      {/* Componente que faz a sidebar colapsar e expandir ao passar o mouse*/}
      <SidebarRail />
    </Sidebar>
  )
}
