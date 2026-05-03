'use client'

import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { createLessonComment } from '@/app/(with-layout)/_actions/course-comments'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { queryKeys } from '@/constants/query-keys'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  content: z.string().min(1, 'Comentário é obrigatório').max(500, 'Comentário deve ter no máximo 500 caracteres'),
})

type FormData = z.infer<typeof formSchema>

type CommentInputProps = {
  parentCommentId?: string
  autoFocus?: boolean
  className?: string
  onCancel?: () => void
  onSuccess?: () => void
}

export function CommentInput({ parentCommentId, autoFocus, onCancel, onSuccess, className }: CommentInputProps) {
  const params = useParams<{ lessonId: string; slug: string }>()
  const lessonId = params.lessonId as string
  const courseSlug = params.slug as string

  const { user } = useUser()

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const queryClient = useQueryClient()

  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: createLessonComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonComments(lessonId),
      })

      reset()

      if (onSuccess) onSuccess()

      toast.success('Comentário enviado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao enviar comentário')
    },
  })

  async function onSubmit({ content }: FormData) {
    createComment({
      courseSlug,
      lessonId,
      content,
      parentId: parentCommentId,
    })
  }

  return (
    <form className={cn('flex gap-4', className)} onSubmit={handleSubmit(onSubmit)}>
      <Avatar src={user?.imageUrl} fallback={user?.fullName} />

      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <Textarea placeholder="Deixe seu comentário sobre a aula..." className="min-h-24" {...field} autoFocus={autoFocus} />
        )}
      />

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}

        <Button type="submit" disabled={isCreatingComment}>
          Comentar
        </Button>
      </div>
    </form>
  )
}
