'use client'

import type { CourseTag } from 'generated/prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type TagItemProps = {
  tag: CourseTag
}

export function TagItem({ tag }: TagItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentIds = searchParams.getAll('tags')
  const currentQuery = searchParams.get('query')

  const isSelected = currentIds.includes(tag.id)

  function onSelect() {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          query: currentQuery,
          tags: isSelected ? currentIds.filter(id => id !== tag.id) : [...currentIds, tag.id],
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    )

    router.push(url)
  }

  return (
    <Badge
      variant={isSelected ? 'default' : 'outline'}
      className={cn('cursor-pointer! whitespace-nowrap hover:border-primary', isSelected && 'border-primary!')}
      onClick={onSelect}
    >
      {tag.name}
    </Badge>
  )
}
