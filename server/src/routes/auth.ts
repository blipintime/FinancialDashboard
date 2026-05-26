import { Router } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../db';
import { signToken } from '../auth/jwt';
import { requireAuth, type AuthedRequest } from '../middleware/requireAuth';

const router = Router();
const BCRYPT_ROUNDS = 10;

function isValidEmail(s: unknown): s is string {
  return typeof s === 'string' && /.+@.+\..+/.test(s);
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'valid email is required' });
    return;
  }
  if (typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'password must be at least 8 characters' });
    return;
  }

  try {
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [name.trim(), email.toLowerCase(), hash]
    );
    const userId: number = rows[0].id;
    res.status(201).json({ token: signToken(userId) });
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505') {
      res.status(409).json({ error: 'email already in use' });
      return;
    }
    console.error('POST /api/auth/register failed:', err);
    res.status(500).json({ error: 'registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!isValidEmail(email) || typeof password !== 'string') {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'invalid credentials' });
      return;
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: 'invalid credentials' });
      return;
    }
    res.json({ token: signToken(user.id) });
  } catch (err) {
    console.error('POST /api/auth/login failed:', err);
    res.status(500).json({ error: 'login failed' });
  }
});

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.userId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/auth/me failed:', err);
    res.status(500).json({ error: 'lookup failed' });
  }
});

export default router;
