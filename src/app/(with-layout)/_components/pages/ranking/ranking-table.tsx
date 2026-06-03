'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Avatar } from '@/components/ui/avatar'
import { DataTable } from '@/components/ui/data-table'
import { cn } from '@/lib/utils'

type RankingTableProps = {
  ranking: RankingUser[]
}

export function RankingTable({ ranking }: RankingTableProps) {
  const columns: ColumnDef<RankingUser>[] = [
    {
      header: 'Posição',
      accessorKey: 'position',
      cell: ({ row }) => {
        const position = row.original.position

        return (
          <p
            className={cn(
              'border border-muted-foreground font-semibold text-lg text-muted-foreground',
              'flex h-10 w-10 items-center justify-center rounded-full',
              position <= 3 && 'text-primary text-xl',
              position === 1 && 'border-primary bg-primary/10 drop-shadow-lg drop-shadow-primary'
            )}
          >
            {position}
          </p>
        )
      },
    },
    {
      header: 'Usuário',
      accessorKey: 'name',
      cell: ({ row }) => {
        const user = row.original

        return (
          <div className="flex items-center gap-2 p-2">
            <Avatar src={user.imageUrl} />
            <p>{user.name}</p>
          </div>
        )
      },
    },
    {
      header: 'Aulas concluídas',
      accessorKey: 'completedLessons',
    },
  ]

  return <DataTable data={ranking} pagination={false} columns={columns} />
}
