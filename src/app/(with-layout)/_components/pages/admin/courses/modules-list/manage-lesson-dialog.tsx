import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import { useEffect } from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Editor } from '@/components/ui/editor'
import { FormField } from '@/components/ui/form-field'
import type { CreateCourseFormData } from '@/server/schemas/course'

const formSchema = z.object({
  title: z.string().nonempty('Título é obrigatório'),
  description: z.string().nonempty('Descrição é obrigatória'),
  videoId: z.string().nonempty('Video é obrigatório'),
  durationInMs: z.number().min(1, { message: 'Campo obrigatório' }),
})

type LessonFormData = z.infer<typeof formSchema>

export type LessonFormItem = LessonFormData & {
  id: string
}

type ManageLessonDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  moduleIndex: number
  initialData?: LessonFormItem | null
  setInitialData: (data: LessonFormItem | null) => void
}

export function ManageLessonDialog({ open, setOpen, moduleIndex, initialData, setInitialData }: ManageLessonDialogProps) {
  const { getValues, setValue, reset: resetForm } = useFormContext<CreateCourseFormData>()

  const form = useForm<LessonFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      videoId: '',
      durationInMs: 0,
    },
  })

  const { handleSubmit, control, reset } = form

  const isEditing = !!initialData

  useEffect(() => {
    if (open && initialData) {
      reset(initialData)
    }
  }, [open, initialData, reset])

  useEffect(() => {
    if (!open) {
      reset({
        title: '',
        description: '',
        videoId: '',
        durationInMs: 0,
      })
      setInitialData(null)
    }
  }, [open, reset, setInitialData])

  function onSubmit(data: LessonFormData) {
    const modules = getValues('modules')

    // Editar aulas
    if (isEditing) {
      modules[moduleIndex].lessons = modules[moduleIndex].lessons.map(lesson => {
        if (lesson.id === initialData.id) {
          return { ...lesson, ...data }
        }

        return lesson
      })
    } else {
      // Criar nova aula
      modules[moduleIndex].lessons.push({
        id: createId(),
        order: 1,
        ...data,
      })
    }

    setValue('modules', modules, { shouldValidate: true })
    resetForm(getValues())
    setOpen(false)
  }

  return (
    <Dialog
      title={isEditing ? 'Editar aula' : 'Adicionar aula'}
      open={open}
      setOpen={setOpen}
      content={
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField control={control} name="title" label="Título" placeholder="Título da aula" />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="col-span-full space-y-3">
                <Editor value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <FormField control={control} name="videoId" label="Vídeo" placeholder="ID do vídeo" />
            <FormField
              control={control}
              name="durationInMs"
              label="Duração"
              onlyNumbers
              placeholder="Duração em milissegundos"
              valueAsNumber
            />
          </div>
          <Button className="ml-auto max-w-max" onClick={() => handleSubmit(onSubmit)()}>
            {isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </form>
      }
    />
  )
}
