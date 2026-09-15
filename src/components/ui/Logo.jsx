import { cx } from '../../lib/cx'

export default function Logo({ className, markClassName }) {
  return (
    <a
      href="/"
      className={cx(
        'inline-flex items-center gap-2.5 rounded-md focus-visible:focus-ring',
        className,
      )}
      aria-label="Orbit — back to top"
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className={cx('h-7 w-7', markClassName)}
      >
        <circle
          cx="16"
          cy="16"
          r="9.5"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          transform="rotate(-24 16 16)"
        />
        <circle cx="16" cy="16" r="3.75" fill="var(--color-accent)" />
        <circle cx="24.5" cy="8" r="1.9" fill="var(--color-amber)" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">
        Orbit
      </span>
    </a>
  )
}
