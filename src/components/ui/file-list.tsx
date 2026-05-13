'use client'

import { FileText } from 'lucide-react'
import prettyBytes from 'pretty-bytes'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

function FileList({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="file-list" className={cn('grid gap-4', className)} {...props} />
}

function FileListItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="file-list-item"
      className={cn('grid gap-4 border bg-card p-4 text-card-foreground shadow', className)}
      {...props}
    />
  )
}

function FileListHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="file-list-header" className={cn('flex items-center gap-4', className)} {...props} />
}

function FileListIcon({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="file-list-icon"
      className={cn(
        "flex size-10 items-center justify-center rounded-lg border bg-muted text-muted-foreground [&>svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    >
      {children ?? <FileText />}
    </div>
  )
}

function FileListInfo({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="file-list-info" className={cn('grid flex-1 gap-1', className)} {...props} />
}

function FileListName({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="file-list-name" className={cn('font-medium text-sm leading-none tracking-tight', className)} {...props} />
}

function FileListDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="file-list-description"
      className={cn('flex items-center gap-2 text-muted-foreground text-xs', className)}
      {...props}
    />
  )
}

function FileListDescriptionSeparator({ children, ...props }: React.ComponentProps<'span'>) {
  return (
    <span data-slot="file-list-description-separator" {...props}>
      {children ?? '•'}
    </span>
  )
}

interface FileListSizeProps extends React.ComponentProps<'span'> {
  children: number
}

function FileListSize({ children, ...props }: FileListSizeProps) {
  return (
    <span data-slot="file-list-size" {...props}>
      {prettyBytes(children)}
    </span>
  )
}

function FileListProgress({ className, ...props }: React.ComponentProps<typeof Progress>) {
  return <Progress data-slot="file-list-progress" className={cn('h-1', className)} {...props} />
}

function FileListDescriptionText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="file-list-description-text"
      className={cn("flex items-center gap-1.5 [&>svg:not([class*='size-'])]:size-3", className)}
      {...props}
    />
  )
}

function FileListContent(props: React.ComponentProps<'div'>) {
  return <div data-slot="file-list-content" {...props} />
}

function FileListActions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="file-list-actions" className={cn('flex items-center gap-2', className)} {...props} />
}

function FileListAction({ className, variant = 'outline', size = 'icon', ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="file-list-action"
      variant={variant}
      size={size}
      type="button"
      className={cn("size-7 [&_svg:not([class*='size-'])]:size-3.5", className)}
      {...props}
    />
  )
}

export {
  FileList,
  FileListAction,
  FileListActions,
  FileListContent,
  FileListDescription,
  FileListDescriptionSeparator,
  FileListDescriptionText,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListProgress,
  FileListSize,
}
