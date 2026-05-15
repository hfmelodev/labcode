import { zodResolver } from '@hookform/resolvers/zod'
import { createId } from '@paralleldrive/cuid2'
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

type ManageModuleDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function ManageModuleDialog({ open, setOpen }: ManageModuleDialogProps) {
  const { getValues, setValue } = useFormContext<CreateCourseFormData>()

  const form = useForm<ModuleFormData>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const { handleSubmit, control } = form

  function onSubmit(data: ModuleFormData) {
    const modules = getValues('modules')

    // TODO: Editar módulos

    // Criar novo módulo
    modules.push({
      ...data,
      id: createId(),
      order: 1,
      lessons: [],
    })

    setValue('modules', modules, { shouldValidate: true })

    setOpen(false)
  }

  return (
    <Dialog
      title="Adicionar Módulo"
      open={open}
      setOpen={setOpen}
      width="500px"
      content={
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField control={control} name="title" label="Título" placeholder="Título do módulo" />
          <FormField control={control} name="description" label="Descrição" placeholder="Descrição do módulo" />
          <Button className="ml-auto max-w-max" onClick={() => handleSubmit(onSubmit)()}>
            Adicionar
          </Button>
        </form>
      }
    />
  )
}
