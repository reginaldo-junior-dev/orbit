import { useState } from 'react'
import { KeyRound, LoaderCircle, UserRound } from 'lucide-react'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import FormNotice from '../components/ui/FormNotice'
import Input from '../components/ui/Input'
import { useAuth } from '../context/auth'
import { initialsOf } from '../lib/name'
import { ROLE } from '../lib/status'
import { updateMe } from '../services/userService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ProfilePage() {
  const { user, setUser } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [status, setStatus] = useState('idle')

  const busy = status === 'saving'

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required'
    if (!email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('saving')
    setFormError(null)
    try {
      const updated = await updateMe({ name: name.trim(), email: email.trim() })
      setUser(updated)
      setStatus('saved')
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors(error.fieldErrors)
      } else {
        setFormError(error.message)
      }
      setStatus('idle')
    }
  }

  const onNameChange = (value) => {
    setName(value)
    if (status === 'saved') setStatus('idle')
    if (fieldErrors.name) setFieldErrors((current) => ({ ...current, name: undefined }))
  }

  const onEmailChange = (value) => {
    setEmail(value)
    if (status === 'saved') setStatus('idle')
    if (fieldErrors.email) setFieldErrors((current) => ({ ...current, email: undefined }))
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Profile
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Manage your personal information and how your orbit appears.
        </p>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-line bg-surface p-6 text-center sm:p-8">
        <span
          className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/15 font-display text-2xl font-semibold text-accent"
          aria-hidden="true"
        >
          {user?.name ? initialsOf(user.name) : '…'}
        </span>
        <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          {user?.name}
        </p>
        <p className="mt-1 text-sm text-ink-2">{user?.email}</p>
        <Chip meta={ROLE[user?.role]} className="mt-3" />
      </div>

      <form
        className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          Profile details
        </h2>
        <p className="mt-1 text-sm text-ink-3">
          Update your name and the email you use to log in.
        </p>

        {status === 'saved' ? <FormNotice className="mt-5">Profile updated.</FormNotice> : null}

        {formError ? <FormNotice tone="error" className="mt-5">{formError}</FormNotice> : null}

        <div className="mt-6 flex flex-col gap-5">
          <Input
            id="profile-name"
            label="Full name"
            placeholder="Your name"
            autoComplete="name"
            error={fieldErrors.name}
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            disabled={busy}
          />

          <Input
            id="profile-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            error={fieldErrors.email}
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            disabled={busy}
          />
        </div>

        <div className="mt-6 flex justify-end border-t border-line pt-6">
          <Button type="submit" size="md" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle
                  className="animate-spin h-4 w-4 motion-reduce:animate-none"
                  aria-hidden="true"
                />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <KeyRound className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Password</p>
            <p className="text-xs text-ink-3">Update your password in Settings.</p>
          </div>
        </div>
        <Button href="/settings" variant="outline" size="sm">
          Change password
        </Button>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink-3">
        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
        Your role is managed by administrators and cannot be changed here.
      </p>
    </div>
  )
}
