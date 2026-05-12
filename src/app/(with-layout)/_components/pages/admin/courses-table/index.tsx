'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Pencil, Search, Send, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Tooltip } from '@/components/ui/tooltip'
import { formatPrice, formatStatus } from '@/lib/utils'

const columns: ColumnDef<CourseWithTagsAndModules>[] = [
  {
    header: 'Título',
    accessorKey: 'title',
  },
  {
    header: 'Tags',
    accessorKey: 'tags',
    cell: ({ row }) => {
      const { tags } = row.original

      const firstTwotags = tags.slice(0, 2)
      const remainingTags = tags.slice(2)

      return (
        <div className="flex gap-1">
          {firstTwotags.map(tag => (
            <Badge
              variant="outline"
              key={`${row.original.id}-${tag.id}`}
              className="select-none border border-primary/30 text-foreground"
            >
              {tag.name}
            </Badge>
          ))}
          {remainingTags.length > 0 && (
            <Tooltip content={remainingTags.map(tag => tag.name).join(', ')}>
              <Badge variant="outline">+{remainingTags.length}</Badge>
            </Tooltip>
          )}
        </div>
      )
    },
  },
  {
    header: 'Preço',
    accessorKey: 'price',
    cell: ({ row }) => {
      const { price, discountPrice } = row.original

      return (
        <div className="flex items-center gap-2">
          {!!discountPrice && <span className="text-[10px] text-muted-foreground line-through">{formatPrice(price)}</span>}
          {formatPrice(discountPrice ?? price)}
        </div>
      )
    },
  },
  {
    header: 'Módulos',
    accessorKey: 'modules',
    cell: ({ row }) => {
      const { modules } = row.original
      return `${modules.length} ${modules.length === 1 ? 'módulo' : 'módulos'}`
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const { status } = row.original
      return <Badge variant={status === 'PUBLISHED' ? 'default' : 'outline'}>{formatStatus(status)}</Badge>
    },
  },
  {
    header: 'Data de criação',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const { createdAt } = row.original
      return format(createdAt, 'dd/MM/yyyy')
    },
  },
  {
    header: '',
    accessorKey: 'actions',
    cell: () => {
      return (
        <div className="flex items-center justify-end gap-2">
          <Tooltip content="Publicar curso">
            <Button variant="ghost" size="icon">
              <Send />
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button variant="ghost" size="icon">
              <Pencil />
            </Button>
          </Tooltip>
          <Tooltip content="Excluir">
            <Button variant="ghost" size="icon">
              <Trash2 />
            </Button>
          </Tooltip>
        </div>
      )
    },
  },
]

interface CoursesTableProps {
  courses: CourseWithTagsAndModules[]
}

export function CoursesTable({ courses }: CoursesTableProps) {
  const [search, setSearch] = useState('')

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const lowerSearch = search.toLowerCase()

      const titleMatch = course.title.toLowerCase().includes(lowerSearch)
      const tagsMatch = course.tags.some(tag => tag.name.toLowerCase().includes(lowerSearch))

      return titleMatch || tagsMatch
    })
  }, [courses, search])

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Pesquisar curso..."
            value={search}
            onChange={({ target }) => setSearch(target.value)}
          />
        </div>
      </div>

      <DataTable columns={columns} data={filteredCourses} />
    </>
  )
}
