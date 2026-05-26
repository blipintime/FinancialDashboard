import { useCallback, useEffect, useState } from 'react';
import UserList from './components/UserList';
import Login from './Login';
import { apiFetch, UnauthorizedError } from './api';
import { clearToken, getToken } from './auth';
import type { User } from './types';

type CurrentUser = { id: number; name: string; email: string };

function App() {
  const [authed, setAuthed] = useState<boolean>(() => getToken() !== null);
  const [me, setMe] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meRes, usersRes] = await Promise.all([
        apiFetch('/api/auth/me'),
        apiFetch('/api/users'),
      ]);
      if (!meRes.ok || !usersRes.ok) {
        throw new Error(`Request failed (${meRes.status}, ${usersRes.status})`);
      }
      setMe(await meRes.json());
      setUsers(await usersRes.json());
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        setAuthed(false);
        return;
      }
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadData();
    }
  }, [authed, loadData]);

  function handleLogout() {
    clearToken();
    setAuthed(false);
    setMe(null);
    setUsers([]);
  }

  if (!authed) {
    return <Login onAuthenticated={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users</h1>
            <p className="mt-1 text-sm text-slate-500">
              Loaded from PostgreSQL via the Node API.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {me && (
              <span className="text-sm text-slate-600">
                Signed in as <span className="font-medium text-slate-900">{me.name}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </header>

        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading users…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
            <p className="font-medium">Failed to load users.</p>
            <p className="mt-1 text-red-600/80">{error}</p>
          </div>
        )}

        {!loading && !error && <UserList users={users} />}
      </div>
    </div>
  );
}

export default App;
