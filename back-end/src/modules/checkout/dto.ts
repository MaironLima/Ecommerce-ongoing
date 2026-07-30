import * as z from 'zod';

export const checkoutCreateSchema = z.object({
  shipping_address: z.record(z.string(), z.any()).optional(),
  currency: z.string().length(3).default('brl'),
  cart_item_ids: z.array(z.string().uuid()).optional(),
});

export const checkoutStatusSchema = z.object({
  orderId: z.string().uuid(),
});