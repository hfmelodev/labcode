import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CoursesList } from './_components/pages/courses/courses-list'
import { CourseTagsList } from './_components/pages/courses/tags-list'

type CoursesPageProps = {
  searchParams: Promise<{
    query: string
    tags: string | string[]
  }>
}

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Explore nossos cursos e aprenda com especialistas',
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { query, tags } = await searchParams

  const suspenseKey = JSON.stringify({ query, tags })

  return (
    <>
      <Suspense key={`tags-${suspenseKey}`} fallback={<Skeleton className="h-5.5 min-h-5.5 w-full" />}>
        <CourseTagsList />
      </Suspense>

      <Suspense key={suspenseKey} fallback={<Skeleton className="flex-1" />}>
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </>
  )
}
