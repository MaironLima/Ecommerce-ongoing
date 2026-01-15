import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from '../config/env.js';



export function auth(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ error: 'The tokens must be provided' });
  }
  if(!JWT_SECRET) {
    return res.status(401).json({ error: 'Token not found' });
  }
  if(!REFRESH_SECRET) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    if (accessToken){
      const payload = jwt.verify(accessToken, JWT_SECRET);
      (req as any).user = payload;
      next();
    } else {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET);
      (req as any).user = payload;
      next();
    }
  
  } catch (err) {
    console.error("Erro ao verificar JWT:", err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
