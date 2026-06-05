import { EditorPreview } from '@/components/ui/editor'
import { LessonComments } from './comments'
import { LessonPlayer } from './lesson-player'

type LessonDetailsProps = {
  lesson: CourseLesson
  nextLesson?: CourseLesson
}

export function LessonDetails({ lesson, nextLesson }: LessonDetailsProps) {
  return (
    <>
      {/* Vídeo da aula */}
      <LessonPlayer lesson={lesson} nextLesson={nextLesson} />

      {/* Descrição e comentários */}
      <div className="flex flex-col gap-6 p-6">
        <EditorPreview className="opacity-90" value={lesson.description} />

        {/* Comentários */}
        <LessonComments />
      </div>
    </>
  )
}
