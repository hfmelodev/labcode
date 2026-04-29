'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export function SearchInput() {
  const [value, setValue] = useState('')

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
