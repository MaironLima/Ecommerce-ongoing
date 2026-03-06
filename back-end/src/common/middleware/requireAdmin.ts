import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from '../../config/env.js';

export default function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'The tokens must be provided' });
  }
  if (!JWT_SECRET) {
    return res.status(401).json({ error: 'Token not found' });
  }
  if (!REFRESH_SECRET) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    let payload;
    if (accessToken) {
      payload = jwt.verify(accessToken, JWT_SECRET);
    } else {
      payload = jwt.verify(refreshToken, REFRESH_SECRET);
    }
    (req as any).user = payload;
    if (!payload || typeof payload === 'string' || payload.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}