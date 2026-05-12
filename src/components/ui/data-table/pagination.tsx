import type { PaginationState, Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Button } from '../button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select/primitives'

interface PaginationProps<TData> {
  table: Table<TData>
  paginationState: PaginationState
}

export function Pagination<TData>({ table, paginationState }: PaginationProps<TData>) {
  const { pageIndex, pageSize } = paginationState
  const pageCount = table.getPageCount()
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <p className="font-medium text-sm">Itens por página</p>
        <Select
          value={`${pageSize}`}
          onValueChange={value => {
            table.setPagination({
              pageIndex: 0,
              pageSize: Number(value),
            })
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 25, 30, 40, 50].map(pageSize => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[150px] items-center justify-center font-medium text-sm">
          Página {pageIndex + 1} de {pageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(Math.max(pageIndex - 1, 0))}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.setPageIndex(Math.min(pageIndex + 1, pageCount - 1))}
            disabled={!canNextPage}
          >
            <span className="sr-only">Página seguinte</span>
            <ChevronRight />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
