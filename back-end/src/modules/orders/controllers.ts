import { Request, Response } from 'express';
import { HttpError, unauthenticated } from '../../common/utils/errors.js';
import { cancelOrderService, getOrderService, listOrdersService, resumeOrderService } from './services.js';

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

export const ordersListController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const orders = await listOrdersService(userId);
    res.status(200).json(orders);
  } catch (e: any) {
    handleError(res, e);
  }
};

export const orderGetController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const orderId = req.params.id;
    if (!orderId) throw new HttpError(400, 'Order id is required', 'INVALID_PARAM');

    const order = await getOrderService(userId, orderId);
    res.status(200).json(order);
  } catch (e: any) {
    handleError(res, e);
  }
};

export const orderCancelController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const orderId = req.params.id;
    if (!orderId) throw new HttpError(400, 'Order id is required', 'INVALID_PARAM');

    const result = await cancelOrderService(userId, orderId);
    res.status(200).json(result);
  } catch (e: any) {
    handleError(res, e);
  }
};

export const orderResumeController = async (req: Request, res: Response) => {
  try {
    const userId = getUserId((req as any).user?.userId);
    const orderId = req.params.id;
    if (!orderId) throw new HttpError(400, 'Order id is required', 'INVALID_PARAM');

    const result = await resumeOrderService(userId, orderId);
    res.status(200).json(result);
  } catch (e: any) {
    handleError(res, e);
  }
};