import * as z from 'zod';

export const productSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 letters for the title' }),
  description: z.string().max(1800, { message: 'Maximum 1800 characters' }),
  basePrice: z.string().min(1, { message: 'Minimum one number for the base price' }),
  category: z.string().min(3, 'Minimum 3 letters for the category'),
  stock: z.string().min(1, { message: 'Minimum one number for the base price' }),
});

export const productAttSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 letters for the title' }).optional(),
  description: z.string().max(1800, { message: 'Maximum 1800 characters' }).optional(),
  basePrice: z.string().min(1, { message: 'Minimum one number for the base price' }).optional(),
  category: z.string().min(3, 'Minimum 3 letters for the category').optional(),
  stock: z.string().min(1, { message: 'Minimum one number for the base price' }).optional(),
});
