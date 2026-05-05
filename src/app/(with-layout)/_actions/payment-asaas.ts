'use server'

import { asaasApi } from '@/lib/asaas'
import { prisma } from '@/lib/prisma'
import { formatName, unMockValue } from '@/lib/utils'
import { ServerError } from '@/server/errors'
import { type PixCheckoutSchema, pixCheckoutSchema } from '@/server/schemas/payment'
import { getUser } from './user'

export async function createCheckoutPix(payload: PixCheckoutSchema) {
  // safeParse => Significa que vai retornar um objeto com a propriedade 'success' (se a validação foi bem sucedida) e os dados ('data') ou erros ('error').
  const input = pixCheckoutSchema.safeParse(payload)

  if (!input.success) {
    throw new ServerError({
      message: 'Falha ao processar o pagamento.',
      code: 'INVALID_DATA',
    })
  }

  const { name, cpf: rawCpf, courseId, postalCode: rawPostalCode, addressNumber } = input.data

  const cpf = unMockValue(rawCpf)
  const postalCode = unMockValue(rawPostalCode)

  const { userId, user } = await getUser()

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  })

  if (!course) {
    throw new ServerError({
      message: 'Curso não encontrado.',
      code: 'NOT_FOUND',
    })
  }

  const userHasCourse = await prisma.coursePurchase.findFirst({
    where: {
      courseId,
      userId,
    },
  })

  if (userHasCourse) {
    throw new ServerError({
      message: 'Você já possui acesso a este curso.',
      code: 'CONFLICT',
    })
  }

  await prisma.coursePurchase.create({
    data: {
      courseId,
      userId,
    },
  })

  let customerId = user?.asaasId

  // Cria o cliente no Asaas se ele não existir
  if (!customerId) {
    const { data: newCustomer } = await asaasApi.post('/customers', {
      name: name ?? formatName(user.firstName, user.lastName),
      email: user.email,
      cpfCnpj: cpf,
      postalCode,
      addressNumber,
      externalReference: userId,
    })

    if (!newCustomer?.id) {
      throw new ServerError({
        message: 'Falha ao processar pagamento.',
        code: 'FAILED_TO_CREATE_CUSTOMER',
      })
    }

    customerId = newCustomer.id as string

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        asaasId: customerId,
      },
    })
  }

  const price = course?.discountPrice ?? course?.price

  const paymentPayload = {
    customer: customerId,
    billingType: 'PIX',
    value: price,
    dueDate: new Date().toISOString().split('T')[0] as string,
    description: `Compra do curso: ${course.title}`,
    externalReference: `${userId}-${courseId}`,
  }

  const { data } = await asaasApi.post('/payments', paymentPayload)

  return {
    invoiceId: data.id as string,
  }
}
