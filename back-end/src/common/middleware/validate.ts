import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env.js';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.headers.authorization;

    if (!JWT_SECRET) throw new Error("The token is not defined");
    if (!accessToken) throw new Error("Authorization token is missing");

    const verify = jwt.verify(accessToken, JWT_SECRET);
    if(!verify) throw new Error("Token not is correct")
      
    next();
  } catch (e) {
    return res.status(401).json({ error: e instanceof Error ? e.message : "Invalid token" });
  }
}