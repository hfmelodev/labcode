import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { GripVertical, Pen, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import type { CreateCourseFormData } from '@/server/schemas/course'
import { LessonsList } from './lessons-list'
import { type LessonFormItem, ManageLessonDialog } from './manage-lesson-dialog'
import { ManageModuleDialog, type ModuleFormItem } from './manage-module-dialog'

export function ModulesList() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCourseFormData>()

  const [showManageModuleDialog, setShowManageModuleDialog] = useState(false)
  const [showManageLessonDialog, setShowManageLessonDialog] = useState(false)

  const [editingModule, setEditingModule] = useState<ModuleFormItem | null>(null)
  const [editingLesson, setEditingLesson] = useState<LessonFormItem | null>(null)
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0)

  const { fields, remove, move } = useFieldArray({
    control,
    name: 'modules',
    keyName: '_id',
  })

  function handleDragEnd({ source, destination }: DropResult) {
    if (destination) {
      move(source.index, destination.index)
    }
  }

  return (
    <div className="col-span-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Módulos</h2>

        <Button variant="outline" type="button" onClick={() => setShowManageModuleDialog(true)}>
          <Plus />
          Adicionar módulo
        </Button>
      </div>

      {!fields.length && <p className="mt-2 text-center text-muted-foreground text-sm">Nenhum módulo adicionado</p>}

      {!!fields.length && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="modules">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="mt-6 flex flex-col gap-4 overflow-hidden">
                {fields.map((field, index) => (
                  <Draggable key={`module-item-${field._id}`} draggableId={`module-item-${field._id}`} index={index}>
                    {provided => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="grid w-full grid-cols-[40px_1fr] items-center overflow-hidden border border-input bg-muted/50"
                      >
                        <div {...provided.dragHandleProps} className="flex h-full w-full items-center justify-center bg-muted/50">
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
                                <Button
                                  variant="outline"
                                  size="icon-sm"
                                  onClick={() => {
                                    setEditingModule(field)
                                    setShowManageModuleDialog(true)
                                  }}
                                >
                                  <Pen />
                                </Button>
                              </Tooltip>

                              <Tooltip content="Excluir módulo">
                                <AlertDialog
                                  title="Excluir módulo"
                                  description="Tem certeza que deseja excluir este módulo? Isso irá deletar todas as aulas deste módulo."
                                  onConfirm={() => remove(index)}
                                >
                                  <Button variant="outline" size="icon-sm">
                                    <Trash />
                                  </Button>
                                </AlertDialog>
                              </Tooltip>

                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setSelectedModuleIndex(index)
                                  setShowManageLessonDialog(true)
                                }}
                              >
                                <Plus />
                                Adicionar aula
                              </Button>
                            </div>
                          </div>

                          {/* Detalhes das aulas */}
                          <LessonsList
                            moduleIndex={index}
                            onEditLesson={lesson => {
                              setSelectedModuleIndex(index)
                              setEditingLesson(lesson)
                              setShowManageLessonDialog(true)
                            }}
                          />

                          {!!errors.modules?.[index]?.lessons?.message && (
                            <p className="text-center text-destructive text-sm">{errors.modules[index].lessons.message}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {!!errors.modules?.message && <p className="mt-2 text-center text-destructive text-sm">{errors.modules.message}</p>}

      <ManageModuleDialog
        open={showManageModuleDialog}
        setOpen={setShowManageModuleDialog}
        initialData={editingModule}
        setInitialData={setEditingModule}
      />

      <ManageLessonDialog
        open={showManageLessonDialog}
        setOpen={setShowManageLessonDialog}
        moduleIndex={selectedModuleIndex}
        initialData={editingLesson}
        setInitialData={setEditingLesson}
      />
    </div>
  )
}
