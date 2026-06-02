'use client'

import { useMutation } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Archive, Loader2, Pencil, Search, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { deleteCourse, updateCourseStatus } from '@/app/(with-layout)/_actions/courses'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Tooltip } from '@/components/ui/tooltip'
import { formatPrice, formatStatus } from '@/lib/utils'

interface CoursesTableProps {
  courses: CourseWithTagsAndModules[]
}

export function CoursesTable({ courses }: CoursesTableProps) {
  const [search, setSearch] = useState('')
  const [updatingCourseId, setUpdatingCourseId] = useState<string | null>(null)
  const [courseIdToDelete, setCourseIdToDelete] = useState<string | null>(null)

  const { mutateAsync: handleDeleteCourse } = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      setCourseIdToDelete(null)
      toast.success('Curso deletado com sucesso!')
    },
    onError: () => {
      setCourseIdToDelete(null)
      toast.error('Erro ao deletar curso!')
    },
  })

  const { mutate: handleUpdateCourseStatus } = useMutation({
    mutationFn: updateCourseStatus,
    onSuccess: () => {
      setUpdatingCourseId(null)
      toast.success('Status do curso atualizado com sucesso!')
    },
    onError: () => {
      setUpdatingCourseId(null)
      toast.error('Erro ao atualizar status do curso!')
    },
  })

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
      cell: ({ row }) => {
        const course = row.original

        const isPublished = course.status === 'PUBLISHED'
        const isThisCourseUpdating = updatingCourseId === course.id
        const isThisCourseDeleting = courseIdToDelete === course.id

        return (
          <div className="flex items-center justify-end gap-2">
            <Tooltip content={`Altera status para ${isPublished ? 'Rascunho' : 'Publicado'}`}>
              <Button
                variant="ghost"
                size="icon"
                disabled={isThisCourseUpdating}
                onClick={() => {
                  setUpdatingCourseId(course.id)
                  handleUpdateCourseStatus({ courseId: course.id, status: isPublished ? 'DRAFT' : 'PUBLISHED' })
                }}
              >
                {isThisCourseUpdating ? <Loader2 className="animate-spin" /> : isPublished ? <Archive /> : <Send />}
              </Button>
            </Tooltip>
            <Tooltip content="Editar">
              <Link passHref href={`/admin/courses/edit/${course.id}`}>
                <Button variant="ghost" size="icon">
                  <Pencil />
                </Button>
              </Link>
            </Tooltip>
            <Tooltip content="Excluir">
              <AlertDialog
                title="Excluir curso"
                description={`Tem certeza que deseja excluir o curso "${course.title}"?`}
                onConfirm={() => {
                  setCourseIdToDelete(course.id)
                  handleDeleteCourse(course.id)
                }}
              >
                <Button variant="ghost" size="icon" disabled={isThisCourseDeleting}>
                  {isThisCourseDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                </Button>
              </AlertDialog>
            </Tooltip>
          </div>
        )
      },
    },
  ]

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
