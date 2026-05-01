'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type BackButtonProps = ComponentProps<'button'>

export function BackButton({ className, ...props }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      {...props}
      className={cn(
        'flex max-w-max items-center gap-2 text-muted-foreground text-xs transition-all hover:text-primary sm:text-sm',
        className
      )}
      onClick={() => router.back()}
      type="button"
    >
      <ArrowLeft size={16} />
      Voltar
    </button>
  )
}
