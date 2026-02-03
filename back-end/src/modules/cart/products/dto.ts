import * as z from 'zod';

const productSchema = z.object({
  title: z.string().min(3, { message: 'Minimum 3 letters for the title' }),
  description: z.string().max(1800, { message: 'Maximum 1800 characters' }),
  basePrice: z.string().min(1, { message: 'Minimum one number for the base price' }),
  category: z.string().min(1, 'Minimum 3 letters for the category')
});

export default productSchema;
