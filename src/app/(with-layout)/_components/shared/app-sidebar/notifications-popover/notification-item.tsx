import { formatDistanceToNow } from 'date-fns'
import { BadgeInfo, Clock } from 'lucide-react'
import Link from 'next/link'

type NotificationItemProps = {
  notification: PlatformNotification
  onClick: () => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const link = notification.link

  const content = (
    <>
      <BadgeInfo className="h-6 w-6 min-w-6 text-primary" />

      <div className="flex-1">
        <div className="mb-1 flex flex-col items-start justify-between text-muted-foreground">
          <p className="mb-2 ml-auto line-clamp-1 flex items-center gap-1 text-xs">
            <Clock className="mr-0.5 h-3.5 w-3.5 min-w-3.5" />
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </p>
          <p className="line-clamp-1 font-bold text-sm">{notification.title}</p>
        </div>

        <p className="text-sm">{notification.content}</p>
      </div>
    </>
  )

  if (link) {
    return (
      <Link href={link} onClick={onClick} className="flex cursor-pointer items-center gap-3 p-2 hover:bg-muted">
        {content}
      </Link>
    )
  }

  return <div className="flex cursor-default items-center gap-3 p-2">{content}</div>
}
