'use server'

import { prisma } from '@/lib/prisma'

const getLastSevenDays = () => {
  const dates: Date[] = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    dates.push(date)
  }

  return dates
}

const getDateKey = (date: Date) => date.toISOString().split('T')[0]

const buildStatsByDay = (items: { createdAt: Date }[]) => {
  const lastSevenDays = getLastSevenDays()
  const counts = new Map(lastSevenDays.map(date => [getDateKey(date), 0] as [string, number]))

  for (const item of items) {
    const dateKey = getDateKey(item.createdAt)
    counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1)
  }

  return lastSevenDays.map(date => ({
    date,
    count: counts.get(getDateKey(date)) ?? 0,
  }))
}

export async function getNewUsersStats(): Promise<StatsChartData[]> {
  const sevenDaysAgo = new Date()

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        // Significa "maior ou igual a 7 dias atrás"
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      // Ordena por data de criação de forma ascendente (do mais antigo para o mais recente)
      createdAt: 'asc',
    },
  })

  return buildStatsByDay(users)
}

export async function getPurchasedCoursesStats(): Promise<StatsChartData[]> {
  const sevenDaysAgo = new Date()

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const purchases = await prisma.coursePurchase.findMany({
    where: {
      createdAt: {
        // Significa "maior ou igual a 7 dias atrás"
        gte: sevenDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      // Ordena por data de criação de forma ascendente (do mais antigo para o mais recente)
      createdAt: 'asc',
    },
  })

  return buildStatsByDay(purchases)
}
