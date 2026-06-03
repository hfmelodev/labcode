'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { sendNotifications } from '@/app/(with-layout)/_actions/notifications'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { FieldError, FieldLabel } from '@/components/ui/field'
import { FormField } from '@/components/ui/form-field'
import { Textarea } from '@/components/ui/textarea'
import { type CreateNotificationSchema, createNotificationSchema } from '@/server/schemas/notifications'

type SendNotificationDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SendNotificationDialog({ open, setOpen }: SendNotificationDialogProps) {
  const form = useForm<CreateNotificationSchema>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      content: '',
      link: '',
    },
  })

  const { handleSubmit, control } = form

  const { mutate: handleSendNotification, isPending: isSendingNotification } = useMutation({
    mutationFn: sendNotifications,
    onSuccess: () => {
      toast.success('Notificação enviada com sucesso!')
      setOpen(false)
      form.reset()
    },
    onError: () => toast.error('Erro ao enviar notificação'),
  })

  function onSubmit(data: CreateNotificationSchema) {
    handleSendNotification(data)
  }

  return (
    <Dialog
      title="Enviar Notificação"
      open={open}
      setOpen={setOpen}
      content={
        <div>
          <p className="mb-6 text-muted-foreground text-sm">
            Preencha o formulário abaixo e envie uma notificação para todos os usuários
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField name="title" control={control} label="Título" />
            <Controller
              name="content"
              control={control}
              render={({ field, fieldState }) => (
                <div className="space-y-3">
                  <FieldLabel htmlFor={field.name}>Conteúdo</FieldLabel>
                  <Textarea {...field} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>
              )}
            />
            <FormField name="link" control={control} label="Link" type="url" />

            <Button type="submit" className="mt-2 ml-auto max-w-max" disabled={isSendingNotification}>
              {isSendingNotification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando
                </>
              ) : (
                'Enviar'
              )}
            </Button>
          </form>
        </div>
      }
    />
  )
}
