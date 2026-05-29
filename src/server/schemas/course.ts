import { CourseDifficulty } from 'generated/prisma/enums'
import { z } from 'zod'

const courseLessonSchema = z.object({
  id: z.cuid2(),
  title: z.string().nonempty('Título é obrigatório'),
  description: z.string().nonempty('Descrição é obrigatória'),
  videoId: z.string().nonempty('Video é obrigatório'),
  durationInMs: z.number().min(1, 'Duração é obrigatória'),
  order: z.number().min(1, 'Campo é obrigatório'),
})

const courseModuleSchema = z.object({
  id: z.cuid2(),
  title: z.string().nonempty('Título é obrigatório'),
  description: z.string().nonempty('Descrição é obrigatória'),
  order: z.number().min(1, 'Campo é obrigatório'),
  lessons: z.array(courseLessonSchema).min(1, 'Pelo menos uma aula é obrigatória'),
})

export type CreateCourseModulePayload = z.infer<typeof courseModuleSchema>

const courseSchema = z.object({
  title: z.string().nonempty('Título é obrigatório'),
  description: z.string().nonempty('Descrição é obrigatória'),
  shortDescription: z.string().optional(),
  thumbnail: z.instanceof(File, { error: 'Thumbnail é obrigatório' }),
  price: z.number().min(1, 'Preço é obrigatório'),
  discountPrice: z.number().optional(),
  difficulty: z.enum(CourseDifficulty, { error: 'Campo é obrigatório' }),
  tagsIds: z.array(z.string()).min(1, 'Selecione pelo menos uma tag'),
})

export const createCourseSchema = courseSchema.extend({
  modules: z.array(courseModuleSchema).min(1, 'Pelo menos um módulo é obrigatório'),
})

export type CreateCourseFormData = z.infer<typeof createCourseSchema>

export const updateCourseSchema = courseSchema.extend({
  id: z.cuid2(),
  thumbnail: z.instanceof(File).optional(),
})

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>
