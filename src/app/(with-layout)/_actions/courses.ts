'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from './user'

type GetCoursesPayload = {
  query?: string
  tags?: string | string[]
}

export async function getCourses({ query, tags: rawTags }: GetCoursesPayload) {
  // Garante que tags será sempre um array
  const tags = !rawTags ? [] : Array.isArray(rawTags) ? rawTags : [rawTags]

  const hasTags = !!tags.length
  const hasQuery = !!query?.trim().length

  const courses = await prisma.course.findMany({
    where: {
      status: 'PUBLISHED',
      tags: hasTags
        ? {
            // Verifica se existe pelo menos uma tag em comum
            some: {
              id: {
                in: tags,
              },
            },
          }
        : undefined,
      OR: hasQuery
        ? [
            {
              title: { contains: query, mode: 'insensitive' },
            },
            {
              description: { contains: query, mode: 'insensitive' },
            },
          ]
        : undefined,
    },
    include: {
      tags: true,
      modules: true,
    },
    orderBy: {
      // Mostra os cursos mais recentes primeiro
      createdAt: 'desc',
    },
  })

  return courses
}

export async function getCourseBySlugOrId(query: string, queryType: 'slug' | 'id' = 'slug') {
  const course = await prisma.course.findUnique({
    where: {
      slug: queryType === 'slug' ? query : undefined,
      id: queryType === 'id' ? query : undefined,
    },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
      tags: true,
    },
  })

  return { course }
}

export async function getPurchasedCourses(detailed = false) {
  const { userId } = await getUser(false)

  if (!userId) return []

  const purchasedCourses = await prisma.coursePurchase.findMany({
    where: {
      userId,
    },
    include: {
      course: detailed ? { include: { tags: true, modules: true } } : true,
    },
  })

  return purchasedCourses.map(purchase => purchase.course)
}

export async function getPurchasedCoursesWithDetails() {
  const purchasedCourses = await getPurchasedCourses(true)

  return purchasedCourses as CourseWithTagsAndModules[]
}
