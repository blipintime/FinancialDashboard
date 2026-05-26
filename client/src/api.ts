import { getToken, clearToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class UnauthorizedError extends Error {}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401) {
    clearToken();
    throw new UnauthorizedError('Unauthorized');
  }
  return res;
}
