import { Request, Response, NextFunction } from 'express';

export default function requireAnyRole(role: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user || !role.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}