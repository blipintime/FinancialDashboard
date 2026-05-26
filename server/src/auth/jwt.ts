import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET is not set');
}

const SECRET: string = secret;
const EXPIRES_IN = '24h';

export type TokenPayload = {
  sub: number;
};

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, SECRET);
  if (typeof decoded === 'string' || typeof decoded.sub !== 'number') {
    throw new Error('Malformed token payload');
  }
  return { sub: decoded.sub };
}
