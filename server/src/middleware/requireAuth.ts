import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../auth/jwt';

export interface AuthedRequest extends Request {
  userId?: number;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const { sub } = verifyToken(token);
    req.userId = sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
