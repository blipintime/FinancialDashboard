import type { Role, User } from '../types';
import RoleBadges from './RoleBadges';

type Props = {
  users: User[];
  isAdmin: boolean;
  onUpdateRoles: (userId: number, roles: Role[]) => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function toggleRole(roles: Role[], role: Role): Role[] {
  return roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role];
}

export default function UserList({ users, isAdmin, onUpdateRoles }: Props) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              Joined
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u, i) => (
            <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
              <td className="px-6 py-4 text-sm font-mono text-slate-500">{u.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{u.name}</td>
              <td className="px-6 py-4 text-sm text-slate-700">{u.email}</td>
              <td className="px-6 py-4">
                <RoleBadges
                  roles={u.roles}
                  editable={isAdmin}
                  onToggle={(role) => onUpdateRoles(u.id, toggleRole(u.roles, role))}
                />
              </td>
              <td className="px-6 py-4 text-sm text-slate-500">{formatDate(u.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
