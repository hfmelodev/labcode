'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { formatName } from '@/lib/utils'

type UsersTableProps = {
  users: AdminUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const lowerSearch = search.toLowerCase()

      const nameMatch = formatName(user.firstName, user.lastName).toLowerCase().includes(lowerSearch)
      const emailMatch = user.email.toLowerCase().includes(lowerSearch)

      return nameMatch || emailMatch
    })
  }, [search, users])

  const columns: ColumnDef<AdminUser>[] = [
    {
      header: 'Nome',
      accessorKey: 'firstName',
      cell: ({ row }) => {
        const user = row.original

        const fullName = formatName(user.firstName, user.lastName)

        return (
          <div className="flex items-center gap-2 p-2">
            <Avatar src={user.imageUrl} fallback={fullName} />
            <p className="font-medium">{fullName}</p>
          </div>
        )
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Cursos comprados',
      accessorKey: 'purchasedCourses',
    },
    {
      header: 'Aulas concluídas',
      accessorKey: 'completedLessons',
    },
    {
      header: 'Data de criação',
      accessorKey: 'createdAt',
      cell: ({ row }) => {
        const user = row.original

        return format(user.createdAt, 'dd/MM/yyyy HH:mm')
      },
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Pesquisar usuário..."
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
        </div>

        <Button>Enviar Notificações</Button>
      </div>

      <DataTable columns={columns} data={filteredUsers} />
    </>
  )
}
