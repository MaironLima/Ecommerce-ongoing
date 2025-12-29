import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';



export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[0];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  if(!JWT_SECRET) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
