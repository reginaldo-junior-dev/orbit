import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

function OrbitMark() {
  return (
    <div className="relative" aria-hidden="true">
      <span
        className="animate-glow-pulse absolute inset-0 rounded-full blur-2xl motion-reduce:animate-none"
        style={{ background: 'color-mix(in oklab, var(--color-accent) 25%, transparent)' }}
      />
      <svg viewBox="0 0 140 140" fill="none" className="relative h-32 w-32">
        <circle cx="70" cy="70" r="46" stroke="var(--color-line)" strokeWidth="2" />
        <circle
          cx="70"
          cy="70"
          r="20"
          fill="var(--color-accent)"
          fillOpacity="0.9"
        />
        <ellipse
          cx="70"
          cy="70"
          rx="60"
          ry="22"
          stroke="var(--color-accent)"
          strokeOpacity="0.45"
          strokeWidth="2"
          transform="rotate(-24 70 70)"
        />
        <circle cx="124" cy="42" r="5" fill="var(--color-amber)" />
      </svg>
    </div>
  )
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-bg px-5 py-12 text-center">
      <div className="animate-fade-in flex flex-col items-center motion-reduce:animate-none">
        <OrbitMark />

        <p className="mt-10 font-display text-7xl font-semibold tracking-tight text-ink sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">
          The page you&apos;re looking for drifted out of orbit. It may have been moved or
          never existed.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="/dashboard" size="lg">
            Back to dashboard
          </Button>
          <Button href="/" variant="ghost" size="lg">
            Back to home
          </Button>
        </div>
      </div>

      <div className="animate-fade-in mt-16 motion-reduce:animate-none" style={{ animationDelay: '0.15s' }}>
        <Logo />
      </div>
    </div>
  )
}
