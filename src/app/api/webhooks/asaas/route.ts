import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const headerList = await headers()

    const token = headerList.get('asaas-access-token')

    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()

    const { event, payment } = body

    if (!event || !payment) return new Response('Error: Bad request', { status: 400 })

    const customerId = payment.customer
    const courseId = payment.externalReference

    // Adicionado pela IA para validar se o curso existe
    if (!courseId) {
      console.warn('Webhook received but no externalReference (courseId) provided')
      return new Response('Webhook received', { status: 200 })
    }

    const courseExists = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    })

    if (!courseExists) {
      console.warn(`Webhook ignored: Course ${courseId} not found`)
      return new Response('Webhook received', { status: 200 })
    }

    const user = await prisma.user.findFirst({
      where: {
        asaasId: customerId,
      },
    })

    if (!user) return new Response('Customer not found', { status: 404 })

    switch (event) {
      // PAYMENT_RECEIVED: PIX
      // PAYMENT_CONFIRMED: Cartão de Crédito
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED': {
        if (event === 'PAYMENT_RECEIVED' && payment.billingType !== 'PIX') {
          return new Response('Webhook received', { status: 200 })
        }

        const userAlreadyHasCourse = await prisma.coursePurchase.findFirst({
          where: {
            userId: user.id,
            courseId,
          },
        })

        if (!userAlreadyHasCourse) {
          await prisma.coursePurchase.create({
            data: {
              courseId,
              userId: user.id,
            },
          })
        }

        return new Response('Webhook received', { status: 200 })
      }
      // Reembolso
      case 'PAYMENT_REFUNDED': {
        const userHashCourse = await prisma.coursePurchase.findFirst({
          where: {
            userId: user.id,
            courseId,
          },
        })

        if (userHashCourse) {
          await prisma.$transaction([
            // Remove a compra do curso se existir
            prisma.coursePurchase.delete({
              where: {
                id: userHashCourse.id,
              },
            }),

            // Remove as aulas concluidas desse curso
            prisma.completedLesson.deleteMany({
              where: {
                userId: user.id,
                courseId,
              },
            }),
          ])
        }

        return new Response('Webhook received', { status: 200 })
      }
      default:
        return new Response('Unhandled event', { status: 200 })
    }
  } catch (err) {
    console.error(err)

    return new Response('Internal Server Error', { status: 500 })
  }
}
