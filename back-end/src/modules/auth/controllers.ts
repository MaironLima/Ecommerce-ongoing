import { Request, Response } from 'express';
import { registerService } from './services.js';
import userSchema from './dto.js';

export const registerController = async (req: Request, res: Response) => {
  try {
    const parsed = userSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }

    const { email, password, name } = parsed.data;
    const user = await registerService(email, password, name);

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refreshController = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
