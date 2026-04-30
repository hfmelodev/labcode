'use client'

import { Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export function SearchInput() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('query') ?? ''

  const [value, setValue] = useState(currentQuery)
  const debouncedValue = useDebounce(value, 500)

  const currentTags = searchParams.getAll('tags')

  useEffect(() => {
    setValue(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    if (currentQuery === debouncedValue) return
    if (!currentQuery && !debouncedValue) return

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          tags: currentTags,
          query: debouncedValue,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    )

    router.push(url)
  }, [currentQuery, debouncedValue, currentTags, pathname, router])

  return (
    <div className="relative max-w-sm flex-1">
      <Input
        className="peer h-9 pl-9"
        placeholder="Busque por um curso..."
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      <Search
        className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground transition-all peer-focus:text-primary"
        size={16}
      />
    </div>
  )
}
