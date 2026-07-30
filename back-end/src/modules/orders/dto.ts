import * as z from 'zod';

export const orderCancelSchema = z.object({
  orderId: z.string().uuid(),
});