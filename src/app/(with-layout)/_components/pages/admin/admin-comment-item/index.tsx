import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn, formatName } from '@/lib/utils'

type AdminCommentItemProps = {
  comment: AdminComment
}

export function AdminCommentItem({ comment }: AdminCommentItemProps) {
  const { lesson, user, repliesCount } = comment

  const course = lesson.module.course
  const lessonModule = lesson.module

  return (
    <Link
      href={`/courses/${course.slug}/${lessonModule.id}/lesson/${lesson.id}`}
      className={cn(
        'flex flex-col items-center justify-between gap-4 border border-muted bg-muted',
        'group p-3 transition-all hover:border-primary md:flex-row'
      )}
    >
      <div className="flex items-center gap-4">
        <Avatar src={user.imageUrl} />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs">
            <p>{formatName(user.firstName, user.lastName)}</p>
            <span>•</span>
            <p className="text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</p>
            <span>•</span>
            <Badge className="cursor-pointer text-xs" variant={repliesCount === 0 ? 'destructive' : 'default'}>
              {repliesCount === 0 ? 'Sem respostas' : `${repliesCount} ${repliesCount === 1 ? 'resposta' : 'respostas'}`}
            </Badge>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-muted-foreground text-xs">{course.title}</p>
          <p className="text-sm">{lesson.title}</p>
        </div>

        <Image
          src={course.thumbnail}
          alt={course.title}
          width={100}
          height={50}
          className="aspect-video border border-muted-foreground object-cover"
        />
      </div>
    </Link>
  )
}
