import Link from 'next/link'
import { BackButton } from '@/components/app/back-button'

type TopDetailsProps = {
  course: Course
}

export function TopDetails({ course }: TopDetailsProps) {
  return (
    <div className="sticky top-0 z-10 flex w-full items-center gap-4 border-border border-b bg-sidebar p-4 sm:gap-6 sm:p-6">
      <BackButton />

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link href={`/courses/details/${course.slug}`} className="line-clamp-1 font-semibold transition-all hover:text-primary">
          {course.title}
        </Link>

        <span className="text-muted-foreground">/</span>

        <p className="line-clamp-1 hidden sm:block">Título do módulo</p>

        <span className="hidden text-muted-foreground sm:block">/</span>

        <p className="line-clamp-1">Título da aula</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Switch de AutoPlay */}
        {/* Ícone para abrir o painel de módulos somente no mobile */}
      </div>
    </div>
  )
}
