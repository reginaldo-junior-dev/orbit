import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CircleAlert,
  RotateCw,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { listUsers } from '../services/adminService'

function AdminSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading admin overview…</span>
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-32 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const fetchData = useCallback(() => listUsers(), [])
  const { data, status, error: loadError, retry } = useApiData(fetchData)
  const users = useMemo(() => data ?? [], [data])

  const summary = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === 'ADMIN').length,
      regular: users.filter((user) => user.role === 'USER').length,
    }),
    [users],
  )

  const forbidden = loadError?.status === 403

  const cards = [
    { key: 'total', label: 'Total users', value: summary.total, icon: Users },
    { key: 'admins', label: 'Administrators', value: summary.admins, icon: ShieldCheck },
    { key: 'regular', label: 'Regular users', value: summary.regular, icon: UserRound },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Admin
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Administrative overview of the Orbit workspace.
        </p>
      </div>

      {status === 'loading' ? <AdminSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert">
          <EmptyState
            tone="error"
            icon={CircleAlert}
            title={forbidden ? 'Access denied' : 'Something went wrong'}
            text={
              forbidden
                ? "You don't have permission to access this area."
                : loadError?.message
            }
            className="border-solid border-error/30 bg-error/5"
          >
            {forbidden ? (
              <Button href="/dashboard" variant="outline" size="sm">
                Back to dashboard
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={retry}>
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </Button>
            )}
          </EmptyState>
        </div>
      ) : null}

      {status === 'ready' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.key}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <card.icon className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                    {card.value}
                  </p>
                  <p className="text-xs text-ink-3">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/admin/users"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40 focus-visible:focus-ring sm:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Users className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Users</p>
                <p className="text-xs text-ink-3">
                  View everyone with access to the workspace.
                </p>
              </div>
            </div>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-ink-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
              aria-hidden="true"
            />
          </Link>
        </>
      ) : null}
    </div>
  )
}
