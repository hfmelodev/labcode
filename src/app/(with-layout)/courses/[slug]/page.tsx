import { notFound, redirect } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { getCourseProgress } from '../../_actions/course-progress'
import { getCourseBySlugOrId } from '../../_actions/courses'

type CoursePageProps = {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course) return notFound()

  // TODO: Verificar se o usuário está logado e se tem acesso ao curso

  const { completedLessons } = await getCourseProgress(slug)

  const allLessons = course.modules.flatMap(module => module.lessons)

  let lessonToRedirect = allLessons[0]

  const firstUncompletedLesson = allLessons.find(lesson => {
    const completed = completedLessons.some(completedLesson => completedLesson.lessonId === lesson.id)
    return !completed
  })

  if (firstUncompletedLesson) {
    lessonToRedirect = firstUncompletedLesson
  }

  if (lessonToRedirect) {
    redirect(`/courses/${slug}/${lessonToRedirect.moduleId}/lesson/${lessonToRedirect.id}`)
  }

  return <Skeleton className="flex-1" />
}
