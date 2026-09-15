import { ChevronDown, CircleAlert } from 'lucide-react'
import { cx } from '../../lib/cx'

export default function Select({ label, hint, error, id, className, children, ...props }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      ) : null}
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cx(
            'h-10 cursor-pointer appearance-none rounded-lg border bg-surface-2 pr-9 pl-3 text-sm text-ink transition-colors duration-200 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50',
            error ? 'border-error/60 hover:border-error/80' : 'border-line hover:border-line-strong',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          className={cx(
            'animate-fade-in mt-2 flex items-start gap-1.5 text-sm text-error motion-reduce:animate-none',
          )}
          style={{ animationDuration: '0.3s' }}
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-sm text-ink-3">
          {hint}
        </p>
      ) : null}
    </label>
  )
}
