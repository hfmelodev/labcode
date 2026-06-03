'use server'

import { checkUserRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { type CreateNotificationSchema, createNotificationSchema } from '@/server/schemas/notifications'
import { getUser } from './user'

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

export async function getNotifications() {
  const { userId } = await getUser()

  if (!userId) throw new Error('Unauthorized')

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  })

  return notifications
}

export async function readAllNotifications() {
  const { userId } = await getUser()

  if (!userId) throw new Error('Unauthorized')

  await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  })
}

// Chamada pelo cron job em /api/cron/notifications — uma vez por dia
// Teste local: curl -H "Authorization: Bearer qualquer-string-aleatoria-longa" http://localhost:25800/api/cron/notifications
export async function deleteOldReadNotifications() {
  const daysToKeep = Number(process.env.DAYS_TO_KEEP ?? 30)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - daysToKeep)

  const { count } = await prisma.notification.deleteMany({
    where: {
      readAt: {
        not: null,
        lt: cutoff,
      },
    },
  })

  return { deleted: count }
}
