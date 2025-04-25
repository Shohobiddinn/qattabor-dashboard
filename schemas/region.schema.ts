import { z } from "zod";

export const regionCreateSchema = z.object({
    title: z.object({
        uz: z.string().min(1, 'Hudud nomi (uz) majburiy'),
        ru: z.string().min(1, 'Hudud nomi (ru) majburiy'),
    }),
    latitude: z.string().min(1, 'Joylashuv majburiy').or(z.number()),
    longitude: z.string().min(1, 'Joylashuv majburiy').or(z.number())
})