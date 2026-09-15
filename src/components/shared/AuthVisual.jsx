import { Check, Sparkles } from 'lucide-react'
import OrbitalBackground from './OrbitalBackground'

function Planet({ className = 'h-44 w-44' }) {
  return (
    <div
      className={`animate-float relative ${className} motion-reduce:animate-none`}
      aria-hidden="true"
    >
      <span
        className="absolute inset-4 rounded-full"
        style={{
          boxShadow: '0 0 60px color-mix(in oklab, var(--color-accent) 40%, transparent)',
        }}
      />
      <svg viewBox="0 0 176 176" fill="none" className="h-full w-full">
        <defs>
          <radialGradient id="planet-glow" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#9d90ff" />
            <stop offset="55%" stopColor="#8b7cff" />
            <stop offset="100%" stopColor="#5b4bc4" />
          </radialGradient>
        </defs>
        <circle cx="88" cy="88" r="38" fill="url(#planet-glow)" />
        <ellipse
          cx="88"
          cy="88"
          rx="74"
          ry="27"
          stroke="var(--color-accent)"
          strokeOpacity="0.55"
          strokeWidth="2.5"
          transform="rotate(-24 88 88)"
        />
        <circle cx="150" cy="52" r="4.5" fill="var(--color-amber)" />
      </svg>
    </div>
  )
}

const REGISTER_FEATURES = [
  'Tasks that plan themselves',
  'Habit streaks that stick',
  'Focus mode for deep work',
  'Weekly insights, honestly',
]

function LoginVisual() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <Planet />
      <h2 className="mt-10 max-w-xs font-display text-3xl font-semibold tracking-tight text-ink">
        Your universe, in order.
      </h2>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
        Tasks, habits and focus in one calm orbit — so every day follows a clear
        path.
      </p>

      <figure className="mt-10 w-full max-w-xs rounded-2xl border border-line bg-surface/80 p-5 text-left backdrop-blur-sm">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        <blockquote className="mt-3 text-sm leading-relaxed text-ink-2">
          A product concept for focused, intentional work — one calm workspace for
          tasks, habits and focus.
        </blockquote>
        <figcaption className="mt-4 border-t border-line pt-4">
          <p className="text-xs font-semibold text-ink">Orbit</p>
          <p className="text-[11px] text-ink-3">Portfolio concept</p>
        </figcaption>
      </figure>
    </div>
  )
}

function RegisterVisual() {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative">
        <Planet className="h-36 w-36" />
        <span
          className="absolute right-6 bottom-2 h-3 w-3 rounded-full bg-amber shadow-[0_0_12px_rgba(255,200,107,0.8)]"
          aria-hidden="true"
        />
      </div>
      <h2 className="mt-8 max-w-xs font-display text-3xl font-semibold tracking-tight text-ink">
        Start your orbit today.
      </h2>
      <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
        One calm workspace for your tasks, habits and focus.
      </p>

      <div className="mt-10 w-full max-w-xs rounded-2xl border border-line bg-surface/80 p-5 text-left backdrop-blur-sm">
        <p className="text-xs font-semibold tracking-wide text-ink uppercase">
          Everything you get from day one
        </p>
        <ul className="mt-4 space-y-3">
          {REGISTER_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-2">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                <Check className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function AuthVisual({ variant = 'login' }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-14">
      <OrbitalBackground />
      {variant === 'register' ? <RegisterVisual /> : <LoginVisual />}
    </div>
  )
}
