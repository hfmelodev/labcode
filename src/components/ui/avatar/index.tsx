import { cn } from '@/lib/utils'
import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from './primitive'

type AvatarProps = {
  src?: string | null
  fallback?: string | null
  className?: string
}

export function Avatar({ src, fallback, className }: AvatarProps) {
  const fallbackLabel =
    fallback
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || '?'

  return (
    <AvatarRoot className={cn('h-8 w-8 rounded-lg', className)}>
      <AvatarImage src={src ?? undefined} alt={fallback ?? ''} />
      <AvatarFallback className="rounded-lg">{fallbackLabel}</AvatarFallback>
    </AvatarRoot>
  )
}
