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

export async function unmarkLessonAsCompleted(lessonId: string) {
  const { userId } = await getUser()

  const completedLesson = await prisma.completedLesson.findFirst({
    where: {
      lessonId,
      userId,
    },
  })

  if (!completedLesson) return

  await prisma.completedLesson.delete({
    where: {
      id: completedLesson.id,
    },
  })
}

export async function getCourseProgress(courseSlug: string) {
  const { userId } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
    include: {
      modules: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  })

  if (!course) throw new Error('Course not found')

  const completedLessons = await prisma.completedLesson.findMany({
    where: {
      courseId: course.id,
      userId,
    },
  })

  const totalLessons = course.modules.flatMap(mod => mod.lessons).length
  const completedLessonsCount = completedLessons.length

  // Calcula o progresso do curso baseado nas aulas completadas
  const progress = Math.round((completedLessonsCount / totalLessons) * 100)

  return {
    completedLessons,
    progress,
  }
}
