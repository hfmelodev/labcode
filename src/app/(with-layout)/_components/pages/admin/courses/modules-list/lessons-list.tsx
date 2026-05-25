import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd'
import { GripVertical, Pen, Trash } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import type { CreateCourseFormData } from '@/server/schemas/course'
import type { LessonFormItem } from './manage-lesson-dialog'

type LessonListProps = {
  moduleIndex: number
  onEditLesson: (lesson: LessonFormItem) => void
}

export function LessonsList({ moduleIndex, onEditLesson }: LessonListProps) {
  const { control } = useFormContext<CreateCourseFormData>()

  const { fields, remove, move } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons`,
    keyName: '_id',
  })

  function handleDragEnd({ source, destination }: DropResult) {
    if (destination) {
      move(source.index, destination.index)
    }
  }

  return (
    <div className="bg-muted p-4">
      {!fields.length && <p className="text-center text-muted-foreground text-sm">Nenhuma aula adicionada</p>}

      {!!fields.length && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="lessons">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 overflow-hidden">
                {fields.map((field, index) => (
                  <Draggable
                    key={`module-lessons-item-${field._id}`}
                    draggableId={`module-lessons-item-${field._id}`}
                    index={index}
                  >
                    {provided => (
                      <div
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        className="grid w-full grid-cols-[30px_1fr] items-center overflow-hidden border border-input bg-card/50"
                      >
                        <div {...provided.dragHandleProps} className="flex h-full w-full items-center justify-center bg-muted/50">
                          <GripVertical size={14} />
                        </div>

                        <div className="flex h-full w-full items-center justify-between gap-4 p-3">
                          <p className="line-clamp-1">{field.title}</p>

                          <div className="flex items-center gap-3">
                            <Tooltip content="Editar aula">
                              <Button variant="outline" size="icon-sm" onClick={() => onEditLesson(field)}>
                                <Pen />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Excluir aula">
                              <AlertDialog
                                title="Excluir aula"
                                description="Tem certeza que deseja excluir esta aula?"
                                onConfirm={() => remove(index)}
                              >
                                <Button variant="outline" size="icon-sm">
                                  <Trash />
                                </Button>
                              </AlertDialog>
                            </Tooltip>
                          </div>
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
    </div>
  )
}
