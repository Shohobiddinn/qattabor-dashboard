import { z } from 'zod'

export const articleSchema = z.object({
  region_id: z.number().min(1, 'Hudud tanlang').or(z.string()),
  title: z.object({
    uz: z.string().min(1, 'Sarlavha (uz) majburiy'),
    ru: z.string().min(1, 'Sarlavha (ru) majburiy'),
  }),
  body: z.object({
    uz: z.string().min(1, 'Tavsif (uz) majburiy'),
    ru: z.string().min(1, 'Tavsif (ru) majburiy'),
  }),
  address: z.object({
    uz: z.string().min(1, 'Manzil (uz) majburiy'),
    ru: z.string().min(1, 'Manzil (ru) majburiy'),
  }),
  phone_number: z.union([
    z.string().min(7, 'Telefon raqam noto‘g‘ri'),
    z.number().int().positive()
  ]),
  owner_id: z.number().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  start_date: z.string().min(1, 'Boshlanish sanasi kerak'),
  end_date: z.string().min(1, 'Tugash sanasi kerak')
})
