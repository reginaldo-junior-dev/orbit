import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircleCheck, LoaderCircle, Mail, User } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import AuthVisual from '../components/shared/AuthVisual'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import FormNotice from '../components/ui/FormNotice'
import Input from '../components/ui/Input'
import Logo from '../components/ui/Logo'
import PasswordInput from '../components/ui/PasswordInput'
import { cx } from '../lib/cx'
import { useAuth } from '../context/auth'
import { PASSWORD_RULE_TEXT, isValidPassword } from '../lib/password'
import { login, register } from '../services/authService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ name, email, password, confirmPassword, terms }) {
  const errors = {}
  if (!name.trim()) {
    errors.name = 'Full name is required'
  }
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  } else if (!isValidPassword(password)) {
    errors.password = PASSWORD_RULE_TEXT
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords don\u2019t match'
  }
  if (!terms) {
    errors.terms = 'You must accept the terms to continue'
  }
  return errors
}

function passwordStrength(value) {
  if (!value) return null
  let score = 0
  if (value.length >= 8) score += 1
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  if (score <= 1) return { segments: 1, level: 'weak', label: 'Weak password' }
  if (score <= 3) return { segments: 2, level: 'medium', label: 'Medium password' }
  return { segments: 3, level: 'strong', label: 'Strong password' }
}

const STRENGTH_COLORS = {
  weak: { bar: 'var(--color-error)', text: 'text-error' },
  medium: { bar: 'var(--color-amber)', text: 'text-amber' },
  strong: { bar: 'var(--color-success)', text: 'text-success' },
}

function PasswordStrength({ value }) {
  const strength = passwordStrength(value)
  if (!strength) return null
  const colors = STRENGTH_COLORS[strength.level]
  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <span className="flex gap-1" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className="h-1 w-8 rounded-full"
            style={{
              backgroundColor:
                index < strength.segments ? colors.bar : 'var(--color-line)',
            }}
          />
        ))}
      </span>
      <span className={cx('text-xs font-medium', colors.text)}>{strength.label}</span>
    </div>
  )
}

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [successMode, setSuccessMode] = useState(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmRef = useRef(null)
  const termsRef = useRef(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { signIn } = useAuth()

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const clearError = (field) =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status !== 'idle') return

    const nextErrors = validate({ name, email, password, confirmPassword, terms })
    setErrors(nextErrors)

    if (nextErrors.name) {
      nameRef.current?.focus()
      return
    }
    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }
    if (nextErrors.confirmPassword) {
      confirmRef.current?.focus()
      return
    }
    if (nextErrors.terms) {
      termsRef.current?.focus()
      return
    }

    setStatus('loading')
    try {
      await register(name.trim(), email.trim(), password)
      try {
        await login(email.trim(), password)
        const ok = await signIn()
        if (ok) {
          setSuccessMode('auto')
          setStatus('success')
          timerRef.current = setTimeout(() => navigate('/dashboard', { replace: true }), 1200)
        } else {
          setSuccessMode('manual')
          setStatus('success')
        }
      } catch {
        setSuccessMode('manual')
        setStatus('success')
      }
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setErrors(error.fieldErrors)
      } else if (error.status === 409) {
        setErrors((current) => ({ ...current, email: 'This email is already registered' }))
      } else {
        setErrors((current) => ({ ...current, form: error.message }))
      }
      setStatus('idle')
    }
  }

  const busy = status === 'loading'
  const success = status === 'success'

  return (
    <AuthLayout visual={<AuthVisual variant="register" />}>
      <div className="animate-fade-in motion-reduce:animate-none">
        <Logo />
      </div>

      <h1
        className="animate-fade-in mt-8 font-display text-3xl font-semibold tracking-tight text-ink motion-reduce:animate-none sm:text-4xl"
        style={{ animationDelay: '0.06s' }}
      >
        Create your account
      </h1>
      <p
        className="animate-fade-in mt-3 text-base leading-relaxed text-ink-2 motion-reduce:animate-none"
        style={{ animationDelay: '0.12s' }}
      >
        Start your orbit today — one calm workspace for everything you do.
      </p>

      {success ? (
        <FormNotice className="mt-6">
          {successMode === 'auto'
            ? 'Account created — taking you to your dashboard…'
            : 'Account created — you can log in now.'}
        </FormNotice>
      ) : null}

      {errors.form ? (
        <FormNotice tone="error" className="mt-6">{errors.form}</FormNotice>
      ) : null}

      <form
        className="animate-fade-in mt-8 flex flex-col gap-5 motion-reduce:animate-none"
        style={{ animationDelay: '0.18s' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <Input
          ref={nameRef}
          id="name"
          type="text"
          label="Full name"
          placeholder="Ava Chen"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name}
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            clearError('name')
            clearError('form')
          }}
          disabled={busy || success}
        />

        <Input
          ref={emailRef}
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            clearError('email')
            clearError('form')
          }}
          disabled={busy || success}
        />

        <PasswordInput
          ref={passwordRef}
          id="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          error={errors.password}
          hint={<PasswordStrength value={password} />}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            clearError('password')
            clearError('form')
          }}
          disabled={busy || success}
        />

        <PasswordInput
          ref={confirmRef}
          id="confirm-password"
          label="Confirm password"
          placeholder="Type your password again"
          autoComplete="new-password"
          error={errors.confirmPassword}
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            clearError('confirmPassword')
            clearError('form')
          }}
          disabled={busy || success}
        />

        <Checkbox
          ref={termsRef}
          id="terms"
          checked={terms}
          onChange={(event) => {
            setTerms(event.target.checked)
            clearError('terms')
            clearError('form')
          }}
          disabled={busy || success}
          error={errors.terms}
        >
          I agree to the Terms of Service and Privacy Policy.
        </Checkbox>

        <Button
          type="submit"
          variant={success ? 'success' : 'primary'}
          size="lg"
          className={`mt-1 w-full ${success ? 'disabled:opacity-100' : ''}`}
          disabled={busy || success}
        >
          {busy ? (
            <>
              <LoaderCircle
                className="animate-spin h-4 w-4 motion-reduce:animate-none"
                aria-hidden="true"
              />
              Creating account…
            </>
          ) : success ? (
            <>
              <CircleCheck className="h-4 w-4" aria-hidden="true" />
              Account created
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      {success && successMode === 'manual' ? (
        <div
          className="animate-fade-in mt-6 motion-reduce:animate-none"
          style={{ animationDuration: '0.3s' }}
        >
          <Button href="/login" variant="outline" size="lg" className="w-full">
            Go to Log in
          </Button>
        </div>
      ) : null}

      <p
        className="animate-fade-in mt-8 text-center text-sm text-ink-3 motion-reduce:animate-none"
        style={{ animationDelay: '0.24s' }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          className="inline-block rounded-sm py-1.5 font-medium text-accent transition-colors hover:text-accent-hover focus-visible:focus-ring"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
