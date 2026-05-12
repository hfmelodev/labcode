import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getAdminCourses } from '../../_actions/courses'
import { CoursesTable } from '../../_components/pages/admin/courses-table'

export default async function AdminCoursesPage() {
  const courses = await getAdminCourses()

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Gerenciar Cursos</h1>

        <Link passHref href="/admin/courses/create">
          <Button>
            <Plus />
            Adicionar curso
          </Button>
        </Link>
      </div>

      <CoursesTable courses={courses} />
    </>
  )
}
