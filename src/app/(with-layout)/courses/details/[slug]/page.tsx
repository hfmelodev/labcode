import { format } from 'date-fns'
import { Calendar, Camera, ChartColumnIncreasing, CirclePlay, Clock, LayoutDashboard } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getCourseBySlugOrId } from '@/app/(with-layout)/_actions/courses'
import { CourseProgress } from '@/app/(with-layout)/_components/pages/courses/course-details/course-progress'
import { BackButton } from '@/components/app/back-button'
import { Badge } from '@/components/ui/badge'
import { EditorPreview } from '@/components/ui/editor'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { prisma } from '@/lib/prisma'
import { cn, formatDifficulty, formatDuration } from '@/lib/utils'

type CourseDetailsPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CourseDetailsPageProps): Promise<Metadata> {
  const { slug } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course)
    return {
      title: 'Curso não encontrado',
    }

  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      images: [course.thumbnail],
    },
  }
}

// Gera as rotas estáticas para cada curso publicado
export async function generateStaticParams() {
  const courses = await prisma.course.findMany({
    select: {
      slug: true,
    },
  })

  return courses.map(course => ({
    slug: course.slug,
  }))
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course) return notFound()

  // Calcula a duração total das aulas do curso
  const totalDuration = course.modules.reduce((acc, mod) => {
    return acc + mod.lessons.reduce((acc, lesson) => acc + lesson.durationInMs, 0)
  }, 0)

  // Calcula o número total de aulas do curso
  const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)

  const details = [
    {
      icon: Clock,
      label: 'Duração',
      value: formatDuration(totalDuration),
    },
    {
      icon: Camera,
      label: 'Aulas',
      value: `${totalLessons} aulas`,
    },
    {
      icon: ChartColumnIncreasing,
      label: 'Dificuldade',
      value: formatDifficulty(course.difficulty),
    },
    {
      icon: Calendar,
      label: 'Data de publicação',
      value: format(course.createdAt, 'dd/MM/yyyy'),
    },
  ]

  return (
    <section className="flex flex-col">
      <div className="flex flex-col justify-between gap-6 md:flex-row">
        <div>
          <BackButton />

          <h1 className="mt-6 font-bold text-3xl sm:text-4xl">{course.title}</h1>

          {course.shortDescription && <p className="text-muted-foreground">{course.shortDescription}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {course.tags.map(tag => (
              <Badge key={tag.id} variant="outline" className="max-w-max">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        <Image
          src={course.thumbnail}
          alt={course.title}
          width={300}
          height={400}
          className="aspect-video w-full border border-primary object-cover md:w-auto"
        />
      </div>

      <Separator className="my-6" />

      <div className="grid w-full gap-10 md:grid-cols-[1fr_400px]">
        {/*Left side*/}
        <Tabs defaultValue="overview">
          <TabsList className="w-full md:max-w-75">
            <TabsTrigger value="overview">
              <LayoutDashboard />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="content">
              <CirclePlay />
              Conteúdo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <EditorPreview className="mt-4 opacity-90" value={course.description} />

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-6">
              {details.map(detail => (
                <div key={detail.label} className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <detail.icon size={20} />
                  </div>

                  <div>
                    <p className="font-medium text-muted-foreground text-sm">{detail.label}</p>
                    <p>{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="content" className="mt-4 flex flex-col gap-6">
            {course.modules.map((mod, index) => (
              <div key={mod.id} className="flex items-center gap-4 bg-muted p-4">
                <div
                  className={cn(
                    'flex h-12 w-12 min-w-12 items-center justify-center border-2 border-primary',
                    'rounded-full bg-primary/10 font-bold text-2xl text-primary'
                  )}
                >
                  {index + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold sm:text-xl">{mod.title}</p>
                    <Badge variant="outline">
                      {mod.lessons.length} aula{mod.lessons.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {!!mod.description && <p className="mt-1 text-muted-foreground text-sm sm:text-base">{mod.description}</p>}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/*Right side*/}
        <Suspense>
          <CourseProgress course={course} />
        </Suspense>
      </div>
    </section>
  )
}
