import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { CircularProgress } from '@/components/app/circular-progress'
import { cn, formatDuration } from '@/lib/utils'
import { LessonItem } from './lesson-item'

type ModuleItemProps = {
  data: CourseModuleWithLessons
}

export function ModuleItem({ data: courseModule }: ModuleItemProps) {
  const totalLessons = courseModule.lessons.length
  // Calcula a duração total do módulo em minutos
  const totalDuration = courseModule.lessons.reduce((total, lesson) => total + lesson.durationInMs, 0)
  const formattedDuration = formatDuration(totalDuration)

  const moduleProgress = 23

  return (
    <Accordion.Item value={courseModule.id} className="group border border-border">
      <Accordion.Trigger className="flex w-full items-center gap-4 p-4 outline-none transition-all hover:bg-muted/50">
        <div
          className={cn(
            'relative flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-muted-foreground/20 font-semibold transition-all',
            moduleProgress >= 100 && 'bg-primary/10 text-primary'
          )}
        >
          {courseModule.order}
          <CircularProgress className="absolute inset-0 h-full w-full" progress={moduleProgress} />
        </div>

        <div className="flex flex-1 flex-col gap-0.5 text-left text-muted-foreground">
          <p className="font-medium text-foreground/80">{courseModule.title}</p>
          <div className="flex items-center gap-2 text-xs">
            <span>
              {totalLessons} aula{totalLessons !== 1 ? 's' : ''}
            </span>
            <span>{formattedDuration}</span>
          </div>
        </div>

        <ChevronDown className="ml-auto h-4 w-4 min-w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
        <div className="flex flex-col gap-2 p-2">
          {courseModule.lessons.map(lesson => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  )
}
