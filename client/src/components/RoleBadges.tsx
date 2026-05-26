import { ALL_ROLES, type Role } from '../types';

type Props = {
  roles: Role[];
  editable: boolean;
  onToggle?: (role: Role) => void;
};

const ROLE_COLORS: Record<Role, string> = {
  Admin: 'bg-red-100 text-red-700 ring-red-200',
  Billing: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Collector: 'bg-amber-100 text-amber-800 ring-amber-200',
  IR: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
};

const INACTIVE_COLORS = 'bg-slate-50 text-slate-400 ring-slate-200';
const BASE = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset';

export default function RoleBadges({ roles, editable, onToggle }: Props) {
  if (!editable) {
    if (roles.length === 0) {
      return <span className="text-xs text-slate-400">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {ALL_ROLES.filter((r) => roles.includes(r)).map((role) => (
          <span key={role} className={`${BASE} ${ROLE_COLORS[role]}`}>
            {role}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {ALL_ROLES.map((role) => {
        const active = roles.includes(role);
        return (
          <button
            key={role}
            type="button"
            onClick={() => onToggle?.(role)}
            className={`${BASE} transition-opacity hover:opacity-80 ${
              active ? ROLE_COLORS[role] : INACTIVE_COLORS
            }`}
            aria-pressed={active}
          >
            {role}
          </button>
        );
      })}
    </div>
  );
}
