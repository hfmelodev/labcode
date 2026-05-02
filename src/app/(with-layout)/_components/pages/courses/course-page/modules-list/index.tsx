'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { PanelRightOpen } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePreferencesStore } from '@/stores/preferences'
import { ModuleItem } from './module-item'

type ModulesListProps = {
  modules: CourseModuleWithLessons[]
}

export function ModulesList({ modules }: ModulesListProps) {
  const moduleId = modules[0].id

  const { expandedModule, setExpandedModule, modulesListCollapsed, setModulesListCollapsed } = usePreferencesStore()

  // Só define o estado de collapsed uma vez, na primeira renderização
  const initialCollapsedIsSet = useRef(false)

  useEffect(() => {
    if (initialCollapsedIsSet.current) return

    initialCollapsedIsSet.current = true

    setModulesListCollapsed(window.innerWidth <= 768)
  }, [setModulesListCollapsed])

  function handleToggleCollapsed() {
    setModulesListCollapsed(!modulesListCollapsed)
  }

  return (
    <aside
      className={cn(
        'h-full min-w-[380px] max-w-[380px] overflow-x-auto overflow-y-auto',
        'border-border border-l bg-sidebar p-4 transition-all duration-200 ease-in-out',
        'flex flex-col items-center',
        !modulesListCollapsed && 'fixed top-0 right-0 bottom-0 z-10 sm:relative',
        modulesListCollapsed && 'hidden w-18 min-w-18 max-w-18 sm:flex'
      )}
    >
      <button
        type="button"
        className={cn(
          'group absolute top-0 bottom-0 left-0 z-10 flex w-4 cursor-e-resize justify-start',
          modulesListCollapsed && 'cursor-w-resize'
        )}
        onClick={handleToggleCollapsed}
      >
        <div className="h-full w-0.5 transition-all group-hover:bg-sidebar-border" />
      </button>

      {modulesListCollapsed ? (
        <Button size="icon" variant="outline" type="button" onClick={handleToggleCollapsed}>
          <PanelRightOpen />
        </Button>
      ) : (
        <>
          <Accordion.Root
            type="single"
            className="flex h-full w-full flex-col gap-3"
            collapsible
            defaultValue={moduleId}
            value={expandedModule || undefined}
            onValueChange={setExpandedModule}
          >
            {modules.map(courseModule => (
              <ModuleItem key={courseModule.id} data={courseModule} />
            ))}
          </Accordion.Root>

          <Button variant="outline" className="mt-auto flex w-full sm:hidden" onClick={handleToggleCollapsed}>
            Fechar módulos
          </Button>
        </>
      )}
    </aside>
  )
}
