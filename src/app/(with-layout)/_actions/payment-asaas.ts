'use server'

import { isAxiosError } from 'axios'
import { headers } from 'next/headers'
import { asaasApi } from '@/lib/asaas'
import { prisma } from '@/lib/prisma'
import { calculateInstallmentOptions, formatName, unMockValue } from '@/lib/utils'
import { ServerError } from '@/server/errors'
import {
  type CreditCardCheckoutSchema,
  creditCardCheckoutSchema,
  type PixCheckoutSchema,
  pixCheckoutSchema,
} from '@/server/schemas/payment'
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
    externalReference: courseId,
  }

  const { data } = await asaasApi.post('/payments', paymentPayload)

  return {
    invoiceId: data.id as string,
  }
}

export async function createCreditCardCheckout(payload: CreditCardCheckoutSchema) {
  const input = creditCardCheckoutSchema.safeParse(payload)

  if (!input.success) {
    throw new ServerError({
      message: 'Falha ao processar pagamento',
      code: 'INVALID_DATA',
    })
  }

  const {
    courseId,
    name,
    cardCvv,
    cardNumber,
    cardValidThru,
    installments,
    cpf: rawCpf,
    postalCode: rawPostalCode,
    addressNumber,
    phone,
  } = input.data

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

  // Cria o cliente no Asaas se ele não existir
  let customerId = user?.asaasId

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

  const installmentOptions = calculateInstallmentOptions(price)
  const installmentData = installmentOptions.find(option => option.installments === installments)

  const installmentTotal = installmentData?.total ?? price

  // Tenta buscar o IP do computador do Cliente
  const nextHeader = await headers()

  const remoteIp = nextHeader.get('x-real-ip') || nextHeader.get('x-forwarded-for') || nextHeader.get('x-client-ip')

  const paymentPayload = {
    customer: customerId,
    billingType: 'CREDIT_CARD',
    value: installmentTotal,
    dueDate: new Date().toISOString().split('T')[0],
    description: `Compra do curso ${course.title}`,
    externalReference: course.id,
    creditCard: {
      holderName: name ?? formatName(user.firstName, user.lastName),
      number: unMockValue(cardNumber),
      expiryMonth: cardValidThru.split('/')[0],
      expiryYear: cardValidThru.split('/')[1],
      ccv: unMockValue(cardCvv),
    },
    creditCardHolderInfo: {
      name: name ?? formatName(user.firstName, user.lastName),
      email: user.email,
      cpfCnpj: cpf,
      postalCode,
      addressNumber,
      phone,
    },
    remoteIp,
    installmentCount: installments > 1 ? installments : undefined,
    installmentValue: installments > 1 ? installmentData?.installmentValue : undefined,
  }

  try {
    await asaasApi.post('/payments', paymentPayload)
  } catch (err) {
    if (!isAxiosError(err)) {
      throw new ServerError({
        message: 'Falha ao processar pagamento.',
        code: 'FAILED_TO_CREATE_CUSTOMER',
      })
    }

    const firstErrorDescription = (err.response?.data?.errors?.[0]?.description ?? '') as string

    if (firstErrorDescription.includes('não autorizada')) {
      throw new ServerError({
        code: 'NOT_AUTHORIZED',
        message: 'Transação não autorizada. Verifique os dados do cartão de crédito e tente novamente.',
      })
    }

    throw new ServerError({
      message: 'Falha ao processar pagamento. Tente novamente mais tarde.',
      code: 'FAILED_TO_CREATE_CUSTOMER',
    })
  }

  // Pagamento aprovado: garante que a compra está salva no banco
  // independente do webhook ter chegado ou não (evita race condition)
  const alreadyPurchased = await prisma.coursePurchase.findFirst({
    where: { userId, courseId },
  })

  if (!alreadyPurchased) {
    await prisma.coursePurchase.create({
      data: { userId, courseId },
    })
  }
}

export async function getPixQrCode(invoiceId: string) {
  await getUser()

  const { data } = await asaasApi.get<PixResponse>(`/payments/${invoiceId}/pixQrCode`)

  return data
}

export async function getInvoiceStatus(invoiceId: string) {
  const { userId } = await getUser()

  const { data } = await asaasApi.get<{ status: string; externalReference: string }>(
    `/payments/${invoiceId}`
  )

  // Se o pagamento foi recebido, garante que a compra está salva no banco
  // independente do webhook ter chegado ou não (evita race condition)
  if (data.status === 'RECEIVED') {
    const courseId = data.externalReference

    const alreadyPurchased = await prisma.coursePurchase.findFirst({
      where: { userId, courseId },
    })

    if (!alreadyPurchased) {
      await prisma.coursePurchase.create({
        data: { userId, courseId },
      })
    }
  }

  return {
    status: data.status as string,
  }
}
