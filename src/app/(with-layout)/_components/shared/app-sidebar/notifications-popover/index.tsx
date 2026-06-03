import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Bell } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { getNotifications, readAllNotifications } from '@/app/(with-layout)/_actions/notifications'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip } from '@/components/ui/tooltip'
import { queryKeys } from '@/constants/query-keys'
import { useIsMobile } from '@/hooks/use-mobile'
import { NotificationItem } from './notification-item'

export function NotificationPopover() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('unread')

  const isMobile = useIsMobile()

  const { data: notifications } = useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: getNotifications,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  })

  useEffect(() => {
    if (!!notifications) {
      const unreadLength = notifications.filter(notification => !notification.readAt).length

      if (unreadLength <= 0) setTab('all')
    }
  }, [notifications])

  const allNotifications = notifications ?? []

  const unreadNotifications = allNotifications.filter(notification => !notification.readAt)

  const queryClient = useQueryClient()

  const { mutate: handleMarkAllAsRead } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications() }),
  })

  const hasUnreadNotifications = !!unreadNotifications.length

  function handleClose() {
    if (hasUnreadNotifications) handleMarkAllAsRead()

    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={value => {
        if (value && hasUnreadNotifications) setTab('unread')

        if (!value) {
          return handleClose()
        }

        setOpen(value)
      }}
    >
      <PopoverTrigger asChild>
        <Tooltip content="Notificações">
          <Button variant="outline" size="icon" className="relative">
            <Bell />

            {hasUnreadNotifications && (
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 min-w-2 rounded-full bg-primary">
                <div className="h-full w-full animate-ping rounded-full bg-primary" />
              </div>
            )}
          </Button>
        </Tooltip>
      </PopoverTrigger>

      <PopoverContent
        side={isMobile ? 'top' : 'right'}
        align={isMobile ? 'center' : 'end'}
        sideOffset={18}
        className="w-95 max-w-screen"
      >
        <p className="mb-2 font-semibold">Notificações</p>

        <Tabs className="w-full" value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="unread">Não lidas</TabsTrigger>
            <TabsTrigger value="all">Todas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="max-h-95 overflow-y-auto pr-2">
            {!allNotifications.length && (
              <p className="py-4 text-center text-muted-foreground text-xs">Nenhuma notificação encontrada.</p>
            )}

            {allNotifications.map((notification, index) => (
              <Fragment key={notification.id}>
                {index > 0 && <Separator className="my-1" />}
                <NotificationItem notification={notification} onClick={handleClose} />
              </Fragment>
            ))}
          </TabsContent>

          <TabsContent value="unread" className="max-h-95 overflow-y-auto pr-2">
            {!unreadNotifications.length && (
              <p className="py-4 text-center text-muted-foreground text-xs">Nenhuma notificação não lida encontrada.</p>
            )}

            {unreadNotifications.map((notification, index) => (
              <Fragment key={notification.id}>
                {index > 0 && <Separator className="my-1" />}
                <NotificationItem notification={notification} onClick={handleClose} />
              </Fragment>
            ))}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
