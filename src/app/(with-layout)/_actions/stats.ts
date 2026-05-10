'use server'

import { prisma } from '@/lib/prisma'

const getLastSevenDays = () => {
  const dates = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    dates.push(date)
  }

  return dates
}

export async function getNewUsersStats(): Promise<StatsChartData[]> {
  const sevenDaysAgo = new Date()

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const users = await prisma.user.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        // Significa "maior ou igual a 7 dias atrás"
        gte: sevenDaysAgo,
      },
    },
    _count: {
      _all: true,
    },
    orderBy: {
      // Ordena por data de criação de forma ascendente (do mais antigo para o mais recente)
      createdAt: 'asc',
    },
  })

  const lastSevenDays = getLastSevenDays()

  const usersCounts = new Map(
    users.map(user => [user.createdAt.toISOString().split('T')[0], user._count._all] as [string, number])
  )

  const stats = lastSevenDays.map(date => ({
    date,
    count: usersCounts.get(date.toISOString().split('T')[0]) || 0,
  }))

  return stats
}

export async function getPurchasedCoursesStats(): Promise<StatsChartData[]> {
  const sevenDaysAgo = new Date()

  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const purchases = await prisma.coursePurchase.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        // Significa "maior ou igual a 7 dias atrás"
        gte: sevenDaysAgo,
      },
    },
    _count: {
      _all: true,
    },
    orderBy: {
      // Ordena por data de criação de forma ascendente (do mais antigo para o mais recente)
      createdAt: 'asc',
    },
  })

  const lastSevenDays = getLastSevenDays()

  const purchasesCounts = new Map(
    purchases.map(purchase => [purchase.createdAt.toISOString().split('T')[0], purchase._count._all] as [string, number])
  )

  const stats = lastSevenDays.map(date => ({
    date,
    count: purchasesCounts.get(date.toISOString().split('T')[0]) || 0,
  }))

  return stats
}
