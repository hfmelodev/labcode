'use server'

import { checkUserRole } from '@/lib/clerk'
import { prisma } from '@/lib/prisma'
import { formatName } from '@/lib/utils'
import { getUser } from './user'

type CreateLessonCommentPayload = {
  courseSlug: string
  lessonId: string
  content: string
  parentId?: string
}

export async function getLessonComments(lessonId: string) {
  await getUser()

  const comments = await prisma.lessonComment.findMany({
    where: { lessonId, parentId: null },
    include: {
      user: true,
      parent: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return comments
}

export async function createLessonComment({ courseSlug, lessonId, content, parentId }: CreateLessonCommentPayload) {
  const { userId, user } = await getUser()

  if (content.length > 500) {
    throw new Error('Comentário deve ter no máximo 500 caracteres')
  }

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
    },
  })

  if (!course) throw new Error('Curso não encontrado')

  // Validar se o usuário é o dono do curso
  const userHashCourse = await prisma.coursePurchase.findFirst({
    where: {
      courseId: course.id,
      userId,
    },
  })

  if (!userHashCourse) {
    throw new Error('Você não tem permissão para comentar neste curso')
  }

  const lesson = await prisma.courseLesson.findUnique({
    where: {
      id: lessonId,
    },
  })

  if (!lesson) throw new Error('Aula não encontrada')

  const comment = await prisma.lessonComment.create({
    data: {
      content,
      lessonId,
      userId,
      parentId,
    },
  })

  // TODO: Notificar usuários (webhooks, emails, etc)
  if (parentId) {
    const parentComment = await prisma.lessonComment.findUnique({
      where: {
        id: parentId,
      },
    })

    const parentUserId = parentComment?.userId

    if (parentUserId && parentUserId !== userId) {
      await prisma.notification.create({
        data: {
          userId: parentUserId,
          title: 'Nova resposta ao seu comentário',
          content: `${formatName(user.firstName, user.lastName)} respondeu o seu comentário no curso "${course.title}"`,
          link: `/courses/${course.slug}/${lesson.moduleId}/lesson/${lessonId}`,
        },
      })
    }
  }

  return comment
}

export async function deleteComment(commentId: string) {
  const { userId } = await getUser()

  const isAdmin = await checkUserRole('admin')

  const comment = await prisma.lessonComment.findUnique({
    where: {
      id: commentId,
    },
  })

  if (!comment) throw new Error('Comentário não encontrado')

  if (!isAdmin && comment.userId !== userId) throw new Error('Você não tem permissão para deletar este comentário')

  await prisma.lessonComment.delete({
    where: {
      id: commentId,
    },
  })
}

export async function getAdminComments() {
  const isAdmin = await checkUserRole('admin')

  if (!isAdmin) throw new Error('Unauthorized')

  const comments = await prisma.lessonComment.findMany({
    where: {
      parentId: null,
    },
    include: {
      user: true,
      lesson: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return comments.map(({ _count, ...comment }) => ({ ...comment, repliesCount: _count.replies }))
}
