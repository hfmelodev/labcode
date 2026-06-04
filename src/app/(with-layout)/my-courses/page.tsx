import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPurchasedCoursesWithDetails } from '../_actions/courses'
import { CourseItem } from '../_components/pages/courses/courses-list/course-item'

export const metadata: Metadata = {
  title: 'Meus Cursos',
}

export default async function PurchasedCoursesPage() {
  const courses = await getPurchasedCoursesWithDetails()

  if (!courses.length) {
    redirect('/')
  }

  return (
    <>
      <h1 className="font-bold text-2xl">Meus Cursos</h1>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map(course => (
          <CourseItem key={course.id} course={course} redirectTo="lessons" />
        ))}
      </section>
    </>
  )
}
