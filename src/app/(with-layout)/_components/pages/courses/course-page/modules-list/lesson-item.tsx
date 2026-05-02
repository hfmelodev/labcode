import { CircleCheckBig, CircleX, Film } from 'lucide-react'
import Link from 'next/link'
import { cn, formatDuration } from '@/lib/utils'

type LessonItemProps = {
  lesson: CourseLesson
}

export function LessonItem({ lesson }: LessonItemProps) {
  const currentLessonId = 'cmojb8vy5000s1qmsys8404kr'
  const completed = false

  const PrimaryIcon = completed ? CircleCheckBig : Film
  const SecondaryIcon = completed ? CircleX : CircleCheckBig

  return (
    // TODO: Lembrar de trocar o course-slug e o module-id por variáveis
    <Link
      href={`/courses/course-slug/module-id/lesson/${lesson.id}`}
      className={cn(
        'flex items-center gap-2 p-2 text-muted-foreground text-sm transition-colors hover:bg-muted',
        lesson.id === currentLessonId && 'text-primary',
        completed && 'text-primary'
      )}
    >
      <button type="button" className="group/lesson-button relative h-4 w-4 min-w-4">
        <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
        <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
      </button>
      <p className="line-clamp-1">{lesson.title}</p>
      <p className="ml-auto text-muted-foreground text-xs">{formatDuration(lesson.durationInMs, true)}</p>
    </Link>
  )
}
