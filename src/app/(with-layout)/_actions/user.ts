'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getUser() {
  const { userId } = await auth()

  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  })

  if (!user) throw new Error('User not found')

  return {
    user,
    clerkUserId: userId,
    userId: user.id,
  }
}
