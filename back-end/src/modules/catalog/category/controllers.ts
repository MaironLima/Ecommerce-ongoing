import { Request, Response } from 'express';
import {
  categoriesService,
} from './services';

export const categoriesController = async (_req: Request, res: Response) => {
  try {
    const { results } = await categoriesService();
    res.status(200).json({ results });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'Error listing categories' });
  }
};

