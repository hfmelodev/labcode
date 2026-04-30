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

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { query, tags } = await searchParams

  const suspenseKey = JSON.stringify({ query, tags })

  return (
    <>
      <Suspense key={`tags-${suspenseKey}`} fallback={<Skeleton className="h-[22px] min-h-[22px] w-full" />}>
        <CourseTagsList />
      </Suspense>

      <Suspense key={suspenseKey} fallback={<Skeleton className="flex-1" />}>
        <CoursesList query={query} tags={tags} />
      </Suspense>
    </>
  )
}
