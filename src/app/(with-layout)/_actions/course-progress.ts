'use server'

import { prisma } from '@/lib/prisma'
import { getUser } from './user'

type CompleteLessonPayload = {
  courseSlug: string
  lessonId: string
}

export async function markLessonAsCompleted({ courseSlug, lessonId }: CompleteLessonPayload) {
  const { userId } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  })

  if (!course) throw new Error('Course not found')

  // TODO: Verificar se o usuário está matriculado no curso

  const isAlreadyCompleted = await prisma.completedLesson.findFirst({
    where: {
      courseId: course.id,
      lessonId,
      userId,
    },
  })

  if (isAlreadyCompleted) return isAlreadyCompleted

  const completedLesson = await prisma.completedLesson.create({
    data: {
      courseId: course.id,
      lessonId,
      userId,
    },
  })

  return completedLesson
}
