import { Router } from 'express';
import { pool } from '../db';
import { requireAdmin } from '../middleware/requireAdmin';

const router = Router();

const ALLOWED_ROLES = ['Admin', 'Billing', 'Collector', 'IR'] as const;
type Role = (typeof ALLOWED_ROLES)[number];

function sanitizeRoles(input: unknown): Role[] | null {
  if (!Array.isArray(input)) return null;
  const out = new Set<Role>();
  for (const entry of input) {
    if (typeof entry !== 'string') return null;
    if (!(ALLOWED_ROLES as readonly string[]).includes(entry)) return null;
    out.add(entry as Role);
  }
  return [...out];
}

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at, roles FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /api/users failed:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

router.put('/:id/roles', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'invalid user id' });
    return;
  }
  const roles = sanitizeRoles(req.body?.roles);
  if (roles === null) {
    res.status(400).json({ error: 'roles must be an array of allowed role names' });
    return;
  }
  try {
    const { rows } = await pool.query(
      'UPDATE users SET roles = $1 WHERE id = $2 RETURNING id, name, email, created_at, roles',
      [roles, id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT /api/users/:id/roles failed:', err);
    res.status(500).json({ error: 'role update failed' });
  }
});

export default router;
