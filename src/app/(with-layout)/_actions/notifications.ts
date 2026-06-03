'use server'

import { checkUserRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { type CreateNotificationSchema, createNotificationSchema } from '@/server/schemas/notifications'

export async function sendNotifications(rawData: CreateNotificationSchema) {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const data = createNotificationSchema.parse(rawData)

  const allUsersIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  })

  await prisma.notification.createMany({
    data: allUsersIds.map(user => ({
      userId: user.id,
      title: data.title,
      content: data.content,
      link: data.link,
    })),
  })
}
