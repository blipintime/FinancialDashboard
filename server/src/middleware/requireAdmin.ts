import type { Response, NextFunction } from 'express';
import { pool } from '../db';
import type { AuthedRequest } from './requireAuth';

export interface AdminRequest extends AuthedRequest {
  userRoles?: string[];
}

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  if (req.userId == null) {
    res.status(401).json({ error: 'not authenticated' });
    return;
  }
  try {
    const { rows } = await pool.query('SELECT roles FROM users WHERE id = $1', [req.userId]);
    const roles: string[] = rows[0]?.roles ?? [];
    if (!roles.includes('Admin')) {
      res.status(403).json({ error: 'admin role required' });
      return;
    }
    req.userRoles = roles;
    next();
  } catch (err) {
    console.error('requireAdmin lookup failed:', err);
    res.status(500).json({ error: 'authorization check failed' });
  }
}
