import { z } from "zod";

export const regionCreateSchema = z.object({
    title: z.string().min(1, 'Hudud nomi majburiy'),
    latitude: z.string().min(1, 'Joylashuv majburiy').or(z.number()),
    longitude: z.string().min(1, 'Joylashuv majburiy').or(z.number())
})