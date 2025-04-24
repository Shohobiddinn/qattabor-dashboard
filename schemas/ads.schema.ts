import { z } from 'zod'

export const adsSchema = z.object({
  title: z.string().min(1, 'Sarlavha majburiy'),
  body: z.string().optional(),
  url: z.string().min(1, 'Manzil majburiy'),
  start_date: z.string().min(1, 'Boshlanish sanasi majburiy'),
  expire_date: z.string().min(1, 'Tugash sanasi majburiy')
})