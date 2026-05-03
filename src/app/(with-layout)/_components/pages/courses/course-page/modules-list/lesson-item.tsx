import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CircleCheckBig, CircleX, Film } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { markLessonAsCompleted, unmarkLessonAsCompleted } from '@/app/(with-layout)/_actions/course-progress'
import { Tooltip } from '@/components/ui/tooltip'
import { queryKeys } from '@/constants/query-keys'
import { cn, formatDuration } from '@/lib/utils'

type LessonItemProps = {
  lesson: CourseLesson & {
    completed: boolean
  }
}

export function LessonItem({ lesson }: LessonItemProps) {
  const params = useParams<{ slug: string }>()
  const courseSlug = params.slug

  const completed = lesson.completed
  const lessonId = lesson.id

  const currentLessonId = 'cmojb8vy5000s1qmsys8404kr'

  const PrimaryIcon = completed ? CircleCheckBig : Film
  const SecondaryIcon = completed ? CircleX : CircleCheckBig

  const queryClient = useQueryClient()

  const { mutate: handleCompleteLesson, isPending: isCompletingLesson } = useMutation({
    mutationFn: () => markLessonAsCompleted({ lessonId, courseSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseSlug) })
      toast.success('Aula marcada como assistida')
    },
    onError: () => {
      toast.error('Erro ao marcar aula como assistida')
    },
  })

  const { mutate: handleUncompleteLesson, isPending: isUncompletingLesson } = useMutation({
    mutationFn: () => unmarkLessonAsCompleted(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseSlug) })
      toast.success('Aula desmarcada como assistida')
    },
    onError: () => {
      toast.error('Erro ao desmarcar aula como assistida')
    },
  })

  const isLoading = isCompletingLesson || isUncompletingLesson

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
      <Tooltip content={completed ? 'Marcar como não assistido' : 'Marcar como assistido'}>
        <button
          type="button"
          className="group/lesson-button relative h-4 w-4 min-w-4 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()

            if (completed) {
              handleUncompleteLesson()
              return
            }

            handleCompleteLesson()
          }}
        >
          <PrimaryIcon className="h-full w-full opacity-100 transition-all group-hover/lesson-button:opacity-0" />
          <SecondaryIcon className="absolute inset-0 h-full w-full opacity-0 transition-all group-hover/lesson-button:opacity-100" />
        </button>
      </Tooltip>
      <p className="line-clamp-1">{lesson.title}</p>
      <p className="ml-auto text-muted-foreground text-xs">{formatDuration(lesson.durationInMs, true)}</p>
    </Link>
  )
}
