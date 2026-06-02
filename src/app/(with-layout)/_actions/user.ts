'use server'

import { auth } from '@clerk/nextjs/server'
import { checkUserRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'

type FilledUser = {
  user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>
  clerkUserId: string
  userId: string
}

type EmptyUser = {
  user: null
  clerkUserId: null
  userId: null
}
// Function Overloading é quando você exporta a função mais de uma vez com parâmetros diferentes
export async function getUser(throwError?: true): Promise<FilledUser>
export async function getUser(throwError: false): Promise<FilledUser | EmptyUser>

export async function getUser(throwError = true): Promise<FilledUser | EmptyUser> {
  const { userId } = await auth()

  const emptyUser: EmptyUser = { user: null, clerkUserId: null, userId: null }

  if (!userId) {
    if (!throwError) return emptyUser
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!user) {
    if (!throwError) return emptyUser
    throw new Error('User not found')
  }

  return {
    user,
    clerkUserId: userId,
    userId: user.id,
  }
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          courses: true,
          completedLessons: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return users.map(({ _count, ...user }) => ({
    ...user,
    purchasedCourses: _count.courses,
    completedLessons: _count.completedLessons,
  }))
}
