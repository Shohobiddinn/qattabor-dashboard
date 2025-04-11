import { z } from 'zod'

export const articleSchema = z.object({
  author_id: z.number().min(1, 'Muallif tanlang'),
  categorie_id: z.number().min(1, 'Kategoriya tanlang'),
  region_id: z.number().min(1, 'Hudud tanlang'),
  is_ad: z.boolean(),
  title: z.string().min(1, 'Sarlavha majburiy'),
  body: z.string().min(1, 'Tavsif majburiy'),
  address: z.string().min(1, 'Manzil majburiy'),
  phone_number: z.union([
    z.string().min(7, 'Telefon raqam noto‘g‘ri'),
    z.number().int().positive()
  ]),
  status: z.boolean(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  start_date: z.string().min(1, 'Boshlanish sanasi kerak'),
  end_date: z.string().min(1, 'Tugash sanasi kerak')
})
