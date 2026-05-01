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
