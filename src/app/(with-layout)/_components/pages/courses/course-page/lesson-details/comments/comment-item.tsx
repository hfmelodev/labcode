'use client'

import { useUser } from '@clerk/nextjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquareQuote, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteComment } from '@/app/(with-layout)/_actions/course-comments'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { queryKeys } from '@/constants/query-keys'
import { cn, formatName } from '@/lib/utils'
import { CommentInput } from './comment-input'

type CommentItemProps = {
  comment: LessonCommentWithUserAndReplies
  className?: string
  parentCommentId?: string
  canReply?: boolean
}

export function CommentItem({ comment, className, parentCommentId, canReply = true }: CommentItemProps) {
  const { user: currentUser } = useUser()
  const isAdmin = currentUser?.publicMetadata?.role === 'admin'
  const user = comment.user

  const authorName = formatName(user.firstName, user.lastName)

  const distanceToNow = formatDistanceToNow(comment.createdAt, {
    addSuffix: true,
  })

  const [isReplying, setIsReplying] = useState(false)

  const queryClient = useQueryClient()

  const { mutate: deleteCommentMutation, isPending: isDeletingComment } = useMutation({
    mutationFn: () => deleteComment(comment.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessonComments(comment.lessonId),
      })

      toast.success('Comentário deletado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao deletar comentário')
    },
  })

  const canDelete = comment.user.clerkUserId === currentUser?.id || isAdmin

  const actions = [
    {
      label: 'Deletar',
      icon: Trash,
      onClick: () => deleteCommentMutation(),
      hidden: !canDelete,
      disabled: isDeletingComment,
    },
    {
      label: 'Responder',
      icon: MessageSquareQuote,
      onClick: () => setIsReplying(true),
      hidden: !canReply,
    },
  ]

  const replies = comment?.replies ?? []

  return (
    <div className={cn('flex flex-col gap-3 bg-foreground/5 p-4 text-sm', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.imageUrl} fallback={authorName} />

          <div>
            <p className="font-semibold">{authorName}</p>
            <p className="text-muted-foreground text-xs">{distanceToNow}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions.map(action => {
            if (action.hidden) return null

            return (
              <Tooltip key={`comment-${comment.id}-action-${action.label}`} content={action.label}>
                <Button variant="outline" size="icon-sm" onClick={action.onClick} disabled={action.disabled}>
                  <action.icon />
                </Button>
              </Tooltip>
            )
          })}
        </div>
      </div>

      <p className="text-muted-foreground">{comment.content}</p>

      {!!replies.length && (
        <div className="flex flex-col gap-2 pl-4">
          {replies.map((reply, index) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              parentCommentId={comment.id}
              className="bg-muted p-3"
              canReply={index === replies.length - 1}
            />
          ))}
        </div>
      )}

      {isReplying && (
        <CommentInput
          parentCommentId={parentCommentId ?? comment.id}
          autoFocus
          onCancel={() => setIsReplying(false)}
          onSuccess={() => setIsReplying(false)}
          className="flex-col bg-muted p-4 sm:flex-row"
        />
      )}
    </div>
  )
}
