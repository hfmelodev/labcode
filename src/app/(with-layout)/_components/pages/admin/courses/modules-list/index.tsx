import { GripVertical, Pen, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import type { CreateCourseFormData } from '@/server/schemas/course'
import { LessonsList } from './lessons-list'
import { ManageModuleDialog } from './manage-module-dialog'

export function ModulesList() {
  const { control } = useFormContext<CreateCourseFormData>()

  const [showManageModuleDialog, setShowManageModuleDialog] = useState(false)

  const { fields } = useFieldArray({
    control,
    name: 'modules',
    keyName: '_id',
  })

  return (
    <div className="col-span-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Módulos</h2>

        <Button variant="outline" type="button" size="sm" onClick={() => setShowManageModuleDialog(true)}>
          <Plus />
          Adicionar módulo
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-4 overflow-hidden">
        {fields.map(field => (
          <div
            key={field.id}
            className="grid w-full grid-cols-[40px_1fr] items-center overflow-hidden border border-input bg-muted/50"
          >
            <div className="flex h-full w-full items-center justify-center bg-muted/50">
              <GripVertical />
            </div>
            <div className="flex h-full w-full flex-col gap-6 p-4">
              {/* Detalhes do módulo */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xl">{field.title}</p>
                  <p className="line-clamp-1 max-w-96 text-muted-foreground text-sm">{field.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Tooltip content="Editar módulo">
                    <Button variant="outline" size="icon-sm">
                      <Pen />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Excluir módulo">
                    <Button variant="outline" size="icon-sm">
                      <Trash />
                    </Button>
                  </Tooltip>

                  <Button variant="secondary">
                    <Plus />
                    Adicionar aula
                  </Button>
                </div>
              </div>

              {/* Detalhes das aulas */}
              <LessonsList />
            </div>
          </div>
        ))}
      </div>

      <ManageModuleDialog open={showManageModuleDialog} setOpen={setShowManageModuleDialog} />
    </div>
  )
}
