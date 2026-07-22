import * as z from 'zod';

export const variantAddSchema = z.object({
  stock: z.string().min(1, { message: 'Minimum one number for the base price' }),
  priceOverride: z.string().min(1, { message: 'Minimum one number for the base price' }),
});
export const variantAttSchema = z.object({
  stock: z.string().min(1, { message: 'Minimum one number for the base price' }).optional(),
  priceOverride: z.string().min(1, { message: 'Minimum one number for the base price' }).optional(),
});
