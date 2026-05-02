import { notFound } from 'next/navigation'
import { getCourseBySlugOrId } from '../../_actions/courses'
import { LessonDetails } from '../../_components/pages/courses/course-page/lesson-details'
import { ModulesList } from '../../_components/pages/courses/course-page/modules-list'
import { TopDetails } from '../../_components/pages/courses/course-page/top-details'

type CoursePageProps = {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course) return notFound()

  // TODO: Verificar se o usuário está logado e se tem acesso ao curso
  // TODO: Validar se é um módulo existente
  // TODO: Validar se é uma aula existente

  return (
    <div className="grid h-screen w-full grid-cols-[1fr_auto] overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <TopDetails course={course} />

        {/* Exibe o vídeo da aula atual */}
        <LessonDetails lesson={course.modules[0].lessons[0]} />
      </div>

      {/* Exibe a lista de módulos e aulas */}
      <ModulesList modules={course.modules} />
    </div>
  )
}
