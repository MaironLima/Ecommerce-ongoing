import { Request, Response } from 'express';
import { categoryService } from './services';

export const categoryController = async (req: Request, res: Response) => {
  try {
    const { results } = await categoryService();

    res.status(200).json({ results });
  } catch (e: any) {
    res.status(400).json({ error: e.message || 'It was not possible to return the categorys' });
  }
};