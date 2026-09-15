import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CircleAlert, RotateCw, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { initialsOf } from '../lib/name'
import { ROLE } from '../lib/status'
import { listUsers } from '../services/adminService'

function UsersSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading users…</span>
      <ul aria-hidden="true" className="space-y-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index}>
            <Skeleton className="h-16 rounded-xl" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AdminUsersPage() {
  const fetchData = useCallback(() => listUsers(), [])
  const { data, status, error: loadError, retry } = useApiData(fetchData)
  const users = data ?? []

  const forbidden = loadError?.status === 403

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:focus-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to admin
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Users
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Everyone with access to the Orbit workspace.
        </p>
      </div>

      {status === 'loading' ? <UsersSkeleton /> : null}

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
          {users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              text="There are no users in the workspace yet."
            />
          ) : (
            <ul className="space-y-2.5">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-line-strong"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
                    aria-hidden="true"
                  >
                    {user.name ? initialsOf(user.name) : '…'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{user.name}</p>
                    <p className="truncate text-xs text-ink-3">{user.email}</p>
                  </div>
                  <Chip meta={ROLE[user.role]} />
                </li>
              ))}
            </ul>
          )}

          <p className="text-center text-xs text-ink-3">
            User management actions are not available yet — this list is read-only for now.
          </p>
        </>
      ) : null}
    </div>
  )
}
