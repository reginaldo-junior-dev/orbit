import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CircleCheck, LoaderCircle, Mail } from 'lucide-react'
import AuthLayout from '../components/layout/AuthLayout'
import Button from '../components/ui/Button'
import FormNotice from '../components/ui/FormNotice'
import Input from '../components/ui/Input'
import Logo from '../components/ui/Logo'
import PasswordInput from '../components/ui/PasswordInput'
import { useAuth } from '../context/auth'
import { login } from '../services/authService'
import { createPreference } from '../services/paymentService'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const errors = {}
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!password) {
    errors.password = 'Password is required'
  }
  return errors
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { signIn } = useAuth()

  const plan = searchParams.get('plan')
  const cycle = searchParams.get('cycle')

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status !== 'idle') return

    const nextErrors = validate({ email, password })
    setErrors(nextErrors)

    if (nextErrors.email) {
      emailRef.current?.focus()
      return
    }
    if (nextErrors.password) {
      passwordRef.current?.focus()
      return
    }

    setStatus('loading')
    try {
      await login(email, password)
      const ok = await signIn()
      if (!ok) {
        setErrors((current) => ({
          ...current,
          form: 'Could not start your session. Please try again.',
        }))
        setStatus('idle')
        return
      }
      setStatus('success')

      if (plan && cycle) {
        try {
          const { checkoutUrl } = await createPreference(plan, cycle)
          window.location.assign(checkoutUrl)
          return
        } catch {
          // Fall back to a normal login redirect — the plan can still be
          // purchased from the Pricing section now that the user is signed in.
        }
      }

      const from = location.state?.from ?? '/dashboard'
      timerRef.current = setTimeout(() => navigate(from, { replace: true }), 900)
    } catch (error) {
      const message =
        error.status === 401
          ? 'Invalid email or password. Please try again.'
          : (error.message ?? 'Something went wrong. Please try again.')
      setErrors((current) => ({ ...current, form: message }))
      setStatus('idle')
    }
  }

  const busy = status === 'loading'
  const success = status === 'success'

  return (
    <AuthLayout>
      <div className="animate-fade-in motion-reduce:animate-none">
        <Logo />
      </div>

      <h1
        className="animate-fade-in mt-8 font-display text-3xl font-semibold tracking-tight text-ink motion-reduce:animate-none sm:text-4xl"
        style={{ animationDelay: '0.06s' }}
      >
        Welcome back
      </h1>
      <p
        className="animate-fade-in mt-3 text-base leading-relaxed text-ink-2 motion-reduce:animate-none"
        style={{ animationDelay: '0.12s' }}
      >
        Log in to pick up your orbit right where you left off.
      </p>

      {success ? (
        <FormNotice className="mt-6">
          {plan && cycle
            ? "You're in — taking you to checkout…"
            : "You're in — heading to your dashboard…"}
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
            if (errors.email || errors.form)
              setErrors((current) => ({ ...current, email: undefined, form: undefined }))
          }}
          disabled={busy || success}
        />

        <PasswordInput
          ref={passwordRef}
          id="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (errors.password || errors.form)
              setErrors((current) => ({ ...current, password: undefined, form: undefined }))
          }}
          disabled={busy || success}
        />

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
              Logging in…
            </>
          ) : success ? (
            <>
              <CircleCheck className="h-4 w-4" aria-hidden="true" />
              Logged in
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>

      <p
        className="animate-fade-in mt-8 text-center text-sm text-ink-3 motion-reduce:animate-none"
        style={{ animationDelay: '0.24s' }}
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="inline-block rounded-sm py-1.5 font-medium text-accent transition-colors hover:text-accent-hover focus-visible:focus-ring"
        >
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
