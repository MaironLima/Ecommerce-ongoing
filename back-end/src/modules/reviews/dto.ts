import z from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .max(5),
  title: z
    .string()
    .min(3, { message: 'Too few characters in the title!' })
    .max(64, { message: 'Too much characters in the title!' }),
  comment: z
    .string()
    .min(3, { message: 'Too few characters in the comment!' })
    .max(600, { message: 'Too much characters in the title!' }),
});