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
        <p className="text-muted-foreground">{lesson.description}</p>

        {/* Comentários */}
      </div>
    </>
  )
}
