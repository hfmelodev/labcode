'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { getLessonComments } from '@/app/(with-layout)/_actions/course-comments'
import { Skeleton } from '@/components/ui/skeleton'
import { queryKeys } from '@/constants/query-keys'
import { CommentInput } from './comment-input'
import { CommentItem } from './comment-item'

export function LessonComments() {
  const params = useParams<{ lessonId: string }>()
  const lessonId = params.lessonId as string

  const { data: comments } = useQuery({
    queryKey: queryKeys.lessonComments(lessonId),
    queryFn: () => getLessonComments(lessonId),
    enabled: !!lessonId,
  })

  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-semibold text-lg">Comentários</h3>

      {!comments ? (
        <Skeleton className="min-h-50 w-full" />
      ) : (
        <>
          {!comments.length && (
            <p className="mb-2 text-muted-foreground text-sm">Nenhum comentário encontrado. Seja o primeiro(a) a comentar!</p>
          )}

          <div className="flex flex-col gap-3">
            {comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          <CommentInput />
        </>
      )}
    </div>
  )
}
