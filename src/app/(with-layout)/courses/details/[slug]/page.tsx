import { format } from 'date-fns'
import { Calendar, Camera, ChartColumnIncreasing, CirclePlay, Clock, LayoutDashboard } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCourseBySlugOrId } from '@/app/(with-layout)/_actions/courses'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDifficulty, formatDuration } from '@/lib/utils'

type CourseDetailsPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params

  const { course } = await getCourseBySlugOrId(slug)

  if (!course) return notFound()

  // Calcula a duração total das aulas
  const totalDuration = course.modules.reduce((acc, mod) => {
    return acc + mod.lessons.reduce((acc, lesson) => acc + lesson.durationInMs, 0)
  }, 0)

  // Calcula o número total de aulas
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
          <p>BACK BUTTON</p>

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
        <Tabs defaultValue="overview">
          <TabsList className="w-full md:max-w-[300px]">
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
            <p className="mt-4 opacity-90">{course.description}</p>

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
          <TabsContent value="content">Conteúdo</TabsContent>
        </Tabs>
        <div>right</div>
      </div>
    </section>
  )
}
