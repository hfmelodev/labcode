'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { markLessonAsCompleted } from '@/app/(with-layout)/_actions/course-progress'
import { queryKeys } from '@/constants/query-keys'
import { usePreferencesStore } from '@/stores/preferences'

const VideoPlayer = dynamic(() => import('./video-player'), { ssr: false })

type LessonPlayerProps = {
  lesson: CourseLesson
  nextLesson?: CourseLesson
}

export function LessonPlayer({ lesson, nextLesson }: LessonPlayerProps) {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const courseSlug = params.slug as string

  const autoplay = usePreferencesStore(state => state.autoplay)
  const setExpandedModule = usePreferencesStore(state => state.setExpandedModule)

  const videoId = lesson.videoId

  const queryClient = useQueryClient()

  const { mutateAsync: handleCompleteLesson } = useMutation({
    mutationFn: () => markLessonAsCompleted({ lessonId: lesson.id, courseSlug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseProgress(courseSlug) })
      toast.success('Aula marcada como assistida')
    },
    onError: () => {
      toast.error('Erro ao marcar aula como assistida')
    },
  })

  async function handleMoveToNextLesson() {
    await handleCompleteLesson()

    if (!autoplay || !nextLesson) return

    if (nextLesson.moduleId !== lesson.moduleId) {
      setExpandedModule(nextLesson.moduleId)
    }

    // Redireciona para a próxima aula
    router.push(`/courses/${courseSlug}/${nextLesson.moduleId}/lesson/${nextLesson.id}`)
  }

  return (
    <div key={videoId} className="aspect-video w-full overflow-hidden dark:bg-black">
      <VideoPlayer videoId={videoId} autoPlay={autoplay} onEnd={handleMoveToNextLesson} />
    </div>
  )
}
