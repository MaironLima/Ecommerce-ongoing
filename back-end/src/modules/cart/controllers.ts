import { Request, Response } from 'express';
import { HttpError, unauthenticated } from '../../common/utils/errors.js';
import { cartAddService, cartDeleteService, cartGetService, cartPutService } from './services.js';
import { cartAddSchema, cartUpdateSchema } from './dto.js';

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

export const cartAddController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const parsed = cartAddSchema.parse(req.body);

    await cartAddService(userId, parsed.variant_id, parsed.quantity);

    res.status(201).json({ message: 'Product added on cart successfully' });
  } catch (e: any) {
    handleError(res, e);
  }
};

export const cartGetController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);

    const cart = await cartGetService(userId);

    res.status(200).json(cart);
  } catch (e: any) {
    handleError(res, e);
  }
};

export const cartPutController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const itemId = req.params.id;
    const parsed = cartUpdateSchema.parse(req.body);

    if (!itemId) throw new HttpError(400, 'Item id is required', 'INVALID_PARAM');

    await cartPutService(userId, itemId, parsed.quantity);

    res.status(200).json({ message: 'The product has been updated' });
  } catch (e: any) {
    handleError(res, e);
  }
};

export const cartDeleteController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const itemId = req.params.id;

    if (!itemId) throw new HttpError(400, 'Item id is required', 'INVALID_PARAM');

    await cartDeleteService(userId, itemId);

    res.status(204).send();
  } catch (e: any) {
    handleError(res, e);
  }
};