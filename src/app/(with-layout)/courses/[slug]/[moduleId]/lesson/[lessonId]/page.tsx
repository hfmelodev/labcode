import { notFound } from 'next/navigation'
import { getCourseBySlugOrId } from '../../../../../_actions/courses'
import { LessonDetails } from '../../../../../_components/pages/courses/course-page/lesson-details'
import { ModulesList } from '../../../../../_components/pages/courses/course-page/modules-list'
import { TopDetails } from '../../../../../_components/pages/courses/course-page/top-details'

type CoursePageProps = {
  params: Promise<{ slug: string; moduleId: string; lessonId: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug, moduleId, lessonId } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course) return notFound()

  // TODO: Verificar se o usuário está logado e se tem acesso ao curso

  const currentModule = course.modules.find(mod => mod.id === moduleId)
  if (!currentModule) return notFound()

  const allLessons = course.modules.flatMap(mod => mod.lessons)

  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === lessonId && lesson.moduleId === moduleId)

  const currentLesson = allLessons[currentLessonIndex]
  const nextLesson = allLessons[currentLessonIndex + 1]

  if (!currentLesson) return notFound()

  return (
    <div className="grid h-screen w-full grid-cols-[1fr_auto] overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <TopDetails course={course} />

        {/* Exibe o vídeo da aula atual */}
        <LessonDetails lesson={currentLesson} nextLesson={nextLesson} />
      </div>

      {/* Exibe a lista de módulos e aulas */}
      <ModulesList modules={course.modules} />
    </div>
  )
}
