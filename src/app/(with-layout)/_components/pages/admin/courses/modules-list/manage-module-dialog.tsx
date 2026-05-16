import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
import { useEffect } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form-field'
import type { CreateCourseFormData } from '@/server/schemas/course'

const formSchema = z.object({
  title: z.string().nonempty('O título do módulo é obrigatório'),
  description: z.string().nonempty('A descrição do módulo é obrigatória'),
})

type ModuleFormData = z.infer<typeof formSchema>

export type ModuleFormItem = ModuleFormData & {
  id: string
}

type ManageModuleDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  initialData?: ModuleFormItem | null
  setInitialData: (data: ModuleFormItem | null) => void
}

export function ManageModuleDialog({ open, setOpen, initialData, setInitialData }: ManageModuleDialogProps) {
  const { getValues, setValue, reset: resetForm } = useFormContext<CreateCourseFormData>()

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
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
      reset({ title: '', description: '' })
      setInitialData(null)
    }
  }, [open, reset, setInitialData])

  function onSubmit(data: ModuleFormData) {
    const modules = getValues('modules')

    // Editar módulo
    if (isEditing) {
      const updateModules = modules.map(mod => {
        if (mod.id === initialData.id) {
          return { ...mod, ...data }
        }

        return mod
      })

      setValue('modules', updateModules, { shouldValidate: true })
      resetForm(getValues())
      setOpen(false)
      return
    }

    // Criar novo módulo
    modules.push({
      ...data,
      id: createId(),
      order: 1,
      lessons: [],
    })

    setValue('modules', modules, { shouldValidate: true })

    resetForm(getValues())

    setOpen(false)
  }

  return (
    <Dialog
      title={isEditing ? 'Editar módulo' : 'Adicionar módulo'}
      open={open}
      setOpen={setOpen}
      width="500px"
      content={
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField control={control} name="title" label="Título" placeholder="Título do módulo" />
          <FormField control={control} name="description" label="Descrição" placeholder="Descrição do módulo" />
          <Button className="ml-auto max-w-max" onClick={() => handleSubmit(onSubmit)()}>
            {isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </form>
      }
    />
  )
}
