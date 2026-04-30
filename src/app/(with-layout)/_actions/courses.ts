'use server'

import { prisma } from '@/lib/prisma'

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
