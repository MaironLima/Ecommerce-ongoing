import * as z from 'zod';

export const cartAddSchema = z.object({
  variant_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).default(1),
});

export const cartUpdateSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});