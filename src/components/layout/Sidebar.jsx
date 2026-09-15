import {
  CheckSquare,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Target,
  UserRound,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { cx } from '../../lib/cx'
import { initialsOf } from '../../lib/name'
import Logo from '../ui/Logo'

const WORKSPACE_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tasks', label: 'Tasks', icon: CheckSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/goals', label: 'Goals', icon: Target },
]

const ACCOUNT_ITEMS = [
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/#pricing', label: 'Upgrade plan', icon: CreditCard },
]

const ADMIN_ITEMS = [{ to: '/admin', label: 'Admin', icon: ShieldCheck }]

const PLAN_LABELS = { PRO: 'Pro', CONSTELLATION: 'Constellation' }

function NavItem({ to, label, icon: Icon, end, onNavigate }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cx(
            'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:focus-ring',
            isActive
              ? 'bg-accent/10 text-ink'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive ? (
              <span
                className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                aria-hidden="true"
              />
            ) : null}
            <Icon
              className={cx('h-4.5 w-4.5 shrink-0', isActive ? 'text-accent' : 'text-ink-3')}
              aria-hidden="true"
            />
            {label}
          </>
        )}
      </NavLink>
    </li>
  )
}

function NavSection({ label, items, onNavigate }) {
  return (
    <div className="px-3">
      <p className="px-3 pt-6 pb-2 text-[11px] font-semibold tracking-[0.12em] text-ink-3 uppercase">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </ul>
    </div>
  )
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex h-full flex-col border-r border-line bg-surface">
      <div className="flex h-16 shrink-0 items-center border-b border-line px-5">
        <Logo />
      </div>

      <nav aria-label="App" className="flex-1 overflow-y-auto pb-6">
        <NavSection label="Workspace" items={WORKSPACE_ITEMS} onNavigate={onNavigate} />
        <NavSection label="Account" items={ACCOUNT_ITEMS} onNavigate={onNavigate} />
        {isAdmin ? (
          <NavSection label="Administration" items={ADMIN_ITEMS} onNavigate={onNavigate} />
        ) : null}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-surface-2">
          <Link
            to="/profile"
            onClick={onNavigate}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:focus-ring"
            aria-label={`Open your profile, ${user?.name ?? ''}`}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
              aria-hidden="true"
            >
              {user?.name ? initialsOf(user.name) : '…'}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-ink">{user?.name}</span>
                {PLAN_LABELS[user?.plan] ? (
                  <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    {PLAN_LABELS[user.plan]}
                  </span>
                ) : null}
              </span>
              <span className="block truncate text-xs text-ink-3">{user?.email}</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-error focus-visible:focus-ring"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
