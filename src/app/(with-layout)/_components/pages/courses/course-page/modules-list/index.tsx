import * as Accordion from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'
import { ModuleItem } from './module-item'

type ModulesListProps = {
  modules: CourseModuleWithLessons[]
}

export function ModulesList({ modules }: ModulesListProps) {
  return (
    <aside
      className={cn(
        'h-full min-w-[380px] max-w-[380px] overflow-x-auto overflow-y-auto',
        'border-border border-l bg-sidebar p-4 transition-all duration-200 ease-in-out',
        'relative flex flex-col items-center'
      )}
    >
      <div className="group absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start">
        <div className="h-full w-0.5 transition-all group-hover:bg-sidebar-border" />
      </div>

      <Accordion.Root type="single" collapsible className="flex h-full w-full flex-col gap-3">
        {modules.map(courseModule => (
          <ModuleItem key={courseModule.id} data={courseModule} />
        ))}
      </Accordion.Root>
    </aside>
  )
}
