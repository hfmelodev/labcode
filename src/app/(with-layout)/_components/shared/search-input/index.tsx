import { Input } from '@/components/ui/input'

export function SearchInput() {
  return (
    <div className="relative max-w-sm flex-1">
      <Input className="h-9" placeholder="Busque por um curso..." />
    </div>
  )
}
