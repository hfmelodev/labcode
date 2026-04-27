import { BookOpen, BookUp2, ChartArea, MessageCircle, SquareDashedBottomCode, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

type NavItem = {
  label: string
  path: string
  icon: React.ElementType
}

export function NavItems() {
  const navItems: NavItem[] = [
    {
      label: 'Cursos',
      path: '/',
      icon: SquareDashedBottomCode,
    },
    {
      label: 'Meus Cursos',
      path: '/my-courses',
      icon: BookUp2,
    },
    {
      label: 'Ranking',
      path: '/ranking',
      icon: Trophy,
    },
  ]

  const adminNavItems: NavItem[] = [
    {
      label: 'Estatísticas',
      path: '/admin',
      icon: ChartArea,
    },
    {
      label: 'Gerenciar Cursos',
      path: '/admin/courses',
      icon: BookOpen,
    },
    {
      label: 'Gerenciar Usuários',
      path: '/admin/users',
      icon: Users,
    },
    {
      label: 'Gerenciar Comentários',
      path: '/admin/comments',
      icon: MessageCircle,
    },
  ]

  function renderNavItems(items: NavItem[]) {
    return items.map(item => (
      <SidebarMenuItem key={item.label}>
        <SidebarMenuButton asChild tooltip={item.label}>
          <Link href={item.path}>
            <item.icon className="text-primary transition-all hover:text-primary group-data-[collapsible=icon]:text-foreground" />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {renderNavItems(navItems)}

        <Separator className="my-2" />

        {renderNavItems(adminNavItems)}
      </SidebarMenu>
    </SidebarGroup>
  )
}
