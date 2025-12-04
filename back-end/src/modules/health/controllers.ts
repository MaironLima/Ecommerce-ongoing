import { pingService } from './service.js';
import { Request, Response } from 'express';

export const pingController = (req: Request, res: Response) => {
  const { ping } = pingService();

  res.json({ ping });
};
