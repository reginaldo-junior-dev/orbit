import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CircleAlert, Pencil, RotateCw, Trash2, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import FormNotice from '../components/ui/FormNotice'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Select from '../components/ui/Select'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/auth'
import useApiData from '../hooks/useApiData'
import { cx } from '../lib/cx'
import { initialsOf } from '../lib/name'
import { ROLE } from '../lib/status'
import { deleteUser, listUsers, updateUser } from '../services/adminService'

const PLAN_LABELS = { PRO: 'Pro', CONSTELLATION: 'Constellation' }

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

function EditUserModal({ user, onClose, onSaved }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const busy = status === 'loading'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    setStatus('loading')
    setError(null)
    try {
      const updated = await updateUser(user.id, { name: name.trim(), email: email.trim(), role })
      onSaved(updated)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit user" description={`Update ${user.name}'s account.`}>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error ? <FormNotice tone="error">{error}</FormNotice> : null}

        <Input
          id="edit-user-name"
          label="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={busy}
        />
        <Input
          id="edit-user-email"
          type="email"
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={busy}
        />
        <Select
          id="edit-user-role"
          label="Role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          disabled={busy}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </Select>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function DeleteUserModal({ user, onClose, onDeleted }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const busy = status === 'loading'

  const handleConfirm = async () => {
    if (busy) return
    setStatus('loading')
    setError(null)
    try {
      await deleteUser(user.id)
      onDeleted(user.id)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Delete user"
      description={`This permanently removes ${user.name} and all their tasks, projects, goals and payments. This can't be undone.`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete user'}
          </Button>
        </>
      }
    >
      {error ? <FormNotice tone="error">{error}</FormNotice> : null}
    </Modal>
  )
}

export default function AdminUsersPage() {
  const fetchData = useCallback(() => listUsers(), [])
  const { data, status, error: loadError, retry, setData } = useApiData(fetchData)
  const users = data ?? []
  const { user: currentUser } = useAuth()

  const [editingUser, setEditingUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

  const forbidden = loadError?.status === 403

  const handleSaved = (updated) => {
    setData((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    setEditingUser(null)
  }

  const handleDeleted = (id) => {
    setData((current) => current.filter((item) => item.id !== id))
    setDeletingUser(null)
  }

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
        users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            text="There are no users in the workspace yet."
          />
        ) : (
          <ul className="space-y-2.5">
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id
              return (
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
                    <p className="truncate text-sm font-medium text-ink">
                      {user.name}
                      {isSelf ? <span className="text-ink-3"> (you)</span> : null}
                    </p>
                    <p className="truncate text-xs text-ink-3">{user.email}</p>
                  </div>
                  {PLAN_LABELS[user.plan] ? (
                    <span className="hidden shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent sm:inline-block">
                      {PLAN_LABELS[user.plan]}
                    </span>
                  ) : null}
                  <Chip meta={ROLE[user.role]} />
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      disabled={isSelf}
                      className={cx(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 focus-visible:focus-ring',
                        isSelf
                          ? 'pointer-events-none opacity-40'
                          : 'hover:bg-surface-2 hover:text-accent',
                      )}
                      aria-label={`Edit ${user.name}`}
                      title={isSelf ? "You can't edit your own account here" : 'Edit user'}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      disabled={isSelf}
                      className={cx(
                        'flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 focus-visible:focus-ring',
                        isSelf
                          ? 'pointer-events-none opacity-40'
                          : 'hover:bg-surface-2 hover:text-error',
                      )}
                      aria-label={`Delete ${user.name}`}
                      title={isSelf ? "You can't delete your own account here" : 'Delete user'}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )
      ) : null}

      {editingUser ? (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={handleSaved}
        />
      ) : null}
      {deletingUser ? (
        <DeleteUserModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onDeleted={handleDeleted}
        />
      ) : null}
    </div>
  )
}
