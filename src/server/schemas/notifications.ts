import { z } from 'zod'

export const createNotificationSchema = z.object({
  title: z.string().nonempty('O título é obrigatório'),
  content: z.string().nonempty('O conteúdo é obrigatório'),
  link: z.string().optional(),
})

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>
