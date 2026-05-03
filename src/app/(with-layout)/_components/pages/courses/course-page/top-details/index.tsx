'use client'

import { PanelRightOpen } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BackButton } from '@/components/app/back-button'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tooltip } from '@/components/ui/tooltip'
import { usePreferencesStore } from '@/stores/preferences'

type TopDetailsProps = {
  course: CourseWithModulesAndLessons
}

export function TopDetails({ course }: TopDetailsProps) {
  const params = useParams<{ moduleId: string; lessonId: string }>()

  const { autoplay, setAutoplay, setModulesListCollapsed } = usePreferencesStore()

  const moduleId = params.moduleId as string
  const lessonId = params.lessonId as string

  const currentModule = course.modules.find(module => module.id === moduleId)
  const currentLesson = currentModule?.lessons.find(lesson => lesson.id === lessonId)

  return (
    <div className="sticky top-0 z-10 flex w-full items-center gap-4 border-border border-b bg-sidebar p-4 sm:gap-6 sm:p-6">
      <BackButton />

      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <Link href={`/courses/details/${course.slug}`} className="line-clamp-1 font-semibold transition-all hover:text-primary">
          {course.title}
        </Link>

        <span className="text-muted-foreground">/</span>

        <p className="line-clamp-1 hidden sm:block">{currentModule?.title}</p>

        <span className="hidden text-muted-foreground sm:block">/</span>

        <p className="line-clamp-1">{currentLesson?.title}</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Switch de AutoPlay */}
        <Tooltip content="Ativar AutoPlay">
          <div className="flex items-center gap-2">
            <p className="block text-xs sm:hidden">AutoPlay</p>
            <Switch checked={autoplay} onCheckedChange={checked => setAutoplay(checked)} />
          </div>
        </Tooltip>

        <Button size="icon" variant="outline" className="flex sm:hidden" onClick={() => setModulesListCollapsed(false)}>
          <PanelRightOpen />
        </Button>
      </div>
    </div>
  )
}
