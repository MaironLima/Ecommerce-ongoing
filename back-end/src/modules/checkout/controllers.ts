import { Request, Response } from 'express';

export const checkoutCreateController = async (req: Request, res: Response) => {
  try {
    // a
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' }) || e;
  }
};

export const checkoutConfirmController = async (req: Request, res: Response) => {
  try {
    //a
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' }) || e;
  }
};
