import { LessonPlayer } from './lesson-player'

type LessonDetailsProps = {
  lesson: CourseLesson
}

export function LessonDetails({ lesson }: LessonDetailsProps) {
  return (
    <>
      {/* Vídeo da aula */}
      <LessonPlayer lesson={lesson} />

      {/* Descrição e comentários */}
      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">{lesson.description}</p>

        {/* Comentários */}
      </div>
    </>
  )
}
