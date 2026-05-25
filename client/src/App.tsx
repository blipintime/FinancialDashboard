import { useEffect, useState } from 'react';
import UserList from './components/UserList';
import type { User } from './types';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/users');
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: User[] = await res.json();
        if (!cancelled) {
          setUsers(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Loaded from PostgreSQL via the Node API.
          </p>
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
            <p className="mt-3 text-xs text-red-500">
              Make sure the backend is running on port 4000 and the database is reachable.
            </p>
          </div>
        )}

        {!loading && !error && <UserList users={users} />}
      </div>
    </div>
  );
}

export default App;
