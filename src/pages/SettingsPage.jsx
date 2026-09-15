import { useCallback, useState } from 'react'
import { KeyRound, LoaderCircle, Palette, ShieldAlert, Trash2, UserRound } from 'lucide-react'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import FormNotice from '../components/ui/FormNotice'
import Modal from '../components/ui/Modal'
import PasswordInput from '../components/ui/PasswordInput'
import Select from '../components/ui/Select'
import { useAuth } from '../context/auth'
import { PASSWORD_RULE_TEXT, isValidPassword } from '../lib/password'
import { ROLE } from '../lib/status'
import { changePassword, deleteMe } from '../services/userService'

function Section({ title, description, children }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-3">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export default function SettingsPage() {
  const { user, logout } = useAuth()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordFormError, setPasswordFormError] = useState(null)
  const [passwordStatus, setPasswordStatus] = useState('idle')

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const closeDeleteModal = useCallback(() => setDeleteOpen(false), [])

  const busySaving = passwordStatus === 'saving'

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    if (busySaving) return

    const nextErrors = {}
    if (!currentPassword) nextErrors.currentPassword = 'Current password is required'
    if (!newPassword) {
      nextErrors.newPassword = 'New password is required'
    } else if (!isValidPassword(newPassword)) {
      nextErrors.newPassword = PASSWORD_RULE_TEXT
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Confirm your new password'
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Passwords don't match"
    }
    setPasswordErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPasswordStatus('saving')
    setPasswordFormError(null)
    try {
      await changePassword({
        currentPassword,
        newPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStatus('saved')
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setPasswordErrors(error.fieldErrors)
      } else {
        setPasswordFormError(error.message)
      }
      setPasswordStatus('idle')
    }
  }

  const resetPasswordStatus = () => {
    if (passwordStatus === 'saved') setPasswordStatus('idle')
  }

  const confirmDelete = async () => {
    if (deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteMe()
      logout()
    } catch (error) {
      setDeleteError(error.message)
      setDeleteOpen(false)
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Manage your account, security and preferences.
        </p>
      </div>

      <Section
        title="Account"
        description="Your basic account information. Changes are made in your profile."
      >
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <UserRound className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user?.name}</p>
              <p className="truncate text-xs text-ink-3">{user?.email}</p>
            </div>
            <Chip meta={ROLE[user?.role]} />
          </div>
          <div className="mt-5 border-t border-line pt-5">
            <Button href="/profile" variant="outline" size="sm">
              Edit in Profile
            </Button>
          </div>
        </div>
      </Section>

      <Section
        title="Security"
        description="Keep your account safe by updating your password regularly."
      >
        <form
          className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
          onSubmit={handlePasswordSubmit}
          noValidate
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <KeyRound className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-ink">Change password</p>
          </div>

          {passwordStatus === 'saved' ? (
            <FormNotice className="mt-5">Password updated.</FormNotice>
          ) : null}

          {passwordFormError ? (
            <FormNotice tone="error" className="mt-5">{passwordFormError}</FormNotice>
          ) : null}

          <div className="mt-6 flex flex-col gap-5">
            <PasswordInput
              id="current-password"
              label="Current password"
              placeholder="Enter your current password"
              autoComplete="current-password"
              error={passwordErrors.currentPassword}
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value)
                resetPasswordStatus()
                if (passwordErrors.currentPassword)
                  setPasswordErrors((current) => ({ ...current, currentPassword: undefined }))
              }}
              disabled={busySaving}
            />

            <PasswordInput
              id="new-password"
              label="New password"
              hint="At least 8 characters with upper and lower case letters and a number."
              placeholder="Enter a new password"
              autoComplete="new-password"
              error={passwordErrors.newPassword}
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value)
                resetPasswordStatus()
                if (passwordErrors.newPassword)
                  setPasswordErrors((current) => ({ ...current, newPassword: undefined }))
              }}
              disabled={busySaving}
            />

            <PasswordInput
              id="confirm-password"
              label="Confirm new password"
              placeholder="Repeat the new password"
              autoComplete="new-password"
              error={passwordErrors.confirmPassword}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                resetPasswordStatus()
                if (passwordErrors.confirmPassword)
                  setPasswordErrors((current) => ({ ...current, confirmPassword: undefined }))
              }}
              disabled={busySaving}
            />
          </div>

          <div className="mt-6 flex justify-end border-t border-line pt-6">
            <Button type="submit" size="md" disabled={busySaving}>
              {busySaving ? (
                <>
                  <LoaderCircle
                    className="animate-spin h-4 w-4 motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Updating…
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </div>
        </form>
      </Section>

      <Section
        title="Preferences"
        description="Visual preferences. New options will appear here as they become available."
      >
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Palette className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Theme</p>
                <p className="text-xs text-ink-3">The Orbit dark theme is the only option for now.</p>
              </div>
            </div>
            <Select aria-label="Theme" className="min-w-28" disabled>
              <option value="dark">Dark</option>
            </Select>
          </div>
        </div>
      </Section>

      <Section
        title="Danger zone"
        description="Irreversible actions. Please proceed with caution."
      >
        <div className="rounded-2xl border border-error/30 bg-surface p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error/10">
                <ShieldAlert className="h-4.5 w-4.5 text-error" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Delete account</p>
                <p className="max-w-sm text-xs leading-relaxed text-ink-3">
                  Permanently removes your account, tasks, projects and goals.
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete account
            </Button>
          </div>

          {deleteError ? (
            <FormNotice tone="error" className="mt-4">{deleteError}</FormNotice>
          ) : null}
        </div>
      </Section>

      <Modal
        open={deleteOpen}
        onClose={closeDeleteModal}
        title="Delete account"
        description="This will permanently delete your account along with all your tasks, projects and goals. This action cannot be undone."
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeDeleteModal} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <LoaderCircle
                    className="animate-spin h-4 w-4 motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete account
                </>
              )}
            </Button>
          </>
        }
      />
    </div>
  )
}
