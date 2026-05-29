'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { checkUserRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import {
  type CreateCourseFormData,
  createCourseSchema,
  type UpdateCourseFormData,
  updateCourseSchema,
} from '@/server/schemas/course'
import { deleteFile, uploadFile } from './upload'
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

export async function getAdminCourses() {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tags: true,
      modules: true,
    },
  })

  return courses
}

export async function getCourseTags() {
  const tags = await prisma.courseTag.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return tags
}

export async function createCourseTag(name: string) {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const tag = await prisma.courseTag.create({
    data: {
      name,
    },
  })

  return tag
}

export async function createCourse(rawData: CreateCourseFormData) {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const data = createCourseSchema.parse(rawData)

  const rawSlug = slugify(data.title, {
    lower: true,
    strict: true,
  })

  const slugCount = await prisma.course.count({
    where: {
      slug: {
        startsWith: rawSlug,
      },
    },
  })

  const slug = slugCount > 0 ? `${rawSlug}-${slugCount + 1}` : rawSlug

  // TODO: Upload thumbnail to Cloudflare R2
  const { url: thumbnail } = await uploadFile({
    file: data.thumbnail,
    path: 'courses-thumbnails',
  })

  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      shortDescription: data.shortDescription,
      price: data.price,
      discountPrice: data.discountPrice,
      difficulty: data.difficulty,
      slug,
      status: 'DRAFT',
      thumbnail,
      tags: {
        connect: data.tagsIds.map(id => ({ id })),
      },
      modules: {
        create: data.modules.map(mod => ({
          title: mod.title,
          description: mod.description,
          order: mod.order,
          lessons: {
            create: mod.lessons.map(lesson => ({
              title: lesson.title,
              description: lesson.description,
              videoId: lesson.videoId,
              durationInMs: lesson.durationInMs,
              order: lesson.order,
            })),
          },
        })),
      },
    },
  })

  revalidatePath('/admin/courses')

  return course
}

export async function updateCourse(rawData: UpdateCourseFormData) {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const data = updateCourseSchema.parse(rawData)

  const course = await prisma.course.findUnique({
    where: {
      id: data.id,
    },
    include: {
      tags: true,
    },
  })

  if (!course) throw new Error('Curso não encontrado')

  let slug = course.slug
  let thumbnailUrl = course.thumbnail

  if (data.title !== course.title) {
    const rawSlug = slugify(data.title, {
      lower: true,
      strict: true,
    })

    const slugCount = await prisma.course.count({
      where: {
        slug: {
          startsWith: rawSlug,
        },
      },
    })

    slug = slugCount > 0 ? `${rawSlug}-${slugCount + 1}` : rawSlug
  }

  if (data.thumbnail) {
    const { url: newThumbnailUrl } = await uploadFile({
      file: data.thumbnail,
      path: 'courses-thumbnails',
    })

    thumbnailUrl = newThumbnailUrl

    await deleteFile(course.thumbnail)
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      difficulty: data.difficulty,
      thumbnail: thumbnailUrl,
      slug,
      tags: {
        set: data.tagsIds.map(id => ({ id })),
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/courses')

  return updatedCourse
}
