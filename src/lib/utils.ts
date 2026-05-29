import { type ClassValue, clsx } from 'clsx'
import { CourseDifficulty } from 'generated/prisma/enums'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(durationInMs: number, showHours = false) {
  const hours = Math.floor(durationInMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((durationInMs % (1000 * 60)) / 1000)

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  if (hours > 0 || showHours) {
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
  }

  return `${formatNumber(minutes)}:${formatNumber(seconds)}`
}

export function formatDifficulty(difficulty: CourseDifficulty) {
  switch (difficulty) {
    case CourseDifficulty.EASY:
      return 'Iniciante'
    case CourseDifficulty.MEDIUM:
      return 'Intermediário'
    case CourseDifficulty.HARD:
      return 'Avançado'
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function formatName(firstName: string, lastName?: string | null) {
  if (!lastName) return firstName

  return `${firstName} ${lastName}`
}

export function formatStatus(status: CourseStatus) {
  switch (status) {
    case 'PUBLISHED':
      return 'Publicado'
    case 'DRAFT':
      return 'Rascunho'
  }
}

export function unMockValue(value: string) {
  return value.replace(/[^0-9a-z]/gi, '')
}

export function calculateInstallmentOptions(price: number) {
  const gatewayFeePercentage = 0.0399 // 3.99% Taxa do Asaas
  const gatewayFeeFixed = 0.8 // 0.49 Taxa do Asaas
  const maxInstallments = 12
  const noInterestInstallments = 6

  const installmentOptions: InstallmentOptions[] = []

  for (let i = 1; i <= maxInstallments; i++) {
    let total = price

    if (i > noInterestInstallments) {
      total += total * gatewayFeePercentage + gatewayFeeFixed
    }

    total = Math.round(total * 100) / 100
    const installmentValue = Math.round((total / i) * 100) / 100

    installmentOptions.push({
      installments: i,
      total,
      installmentValue,
      hasInterest: i > noInterestInstallments,
    })
  }

  return installmentOptions
}

export async function urlToFile(url: string): Promise<File> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch image from URL')
  }

  const blob = await response.blob()
  const contentType = response.headers.get('Content-Type') || 'application/octet-stream'

  const urlPath = url.split('/').pop() || 'file'

  const parts = urlPath.split('-')
  const fileName = parts.length > 1 ? parts.slice(1).join('-') : urlPath
  return new File([blob], fileName, { type: contentType })
}
