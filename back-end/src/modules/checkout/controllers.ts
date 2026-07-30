import { Request, Response } from 'express';
import { HttpError, unauthenticated } from '../../common/utils/errors.js';
import { createCheckoutSessionService, getCheckoutStatusService } from './services.js';
import { checkoutCreateSchema } from './dto.js';

function getUserId(userId: string | undefined): string {
  if (!userId) throw unauthenticated();
  return userId;
}

function handleError(res: Response, e: any) {
  if (e instanceof HttpError) {
    return res.status(e.status).json({ error: e.message, code: e.code });
  }
  return res.status(400).json({ error: e?.message || 'Unexpected error' });
}

export const checkoutCreateController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const parsed = checkoutCreateSchema.parse(req.body);

    const result = await createCheckoutSessionService(
      userId,
      parsed.shipping_address as Record<string, unknown> | undefined,
      parsed.currency,
      parsed.cart_item_ids,
    );

    res.status(201).json(result);
  } catch (e: any) {
    handleError(res, e);
  }
};

export const checkoutStatusController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const orderId = req.params.orderId;

    if (!orderId) throw new HttpError(400, 'orderId is required', 'INVALID_PARAM');

    const result = await getCheckoutStatusService(userId, orderId);

    res.status(200).json(result);
  } catch (e: any) {
    handleError(res, e);
  }
};