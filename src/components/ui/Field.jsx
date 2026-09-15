import { CircleAlert } from 'lucide-react'
import { cx } from '../../lib/cx'

export default function Field({
  label,
  labelAction,
  htmlFor,
  error,
  hint,
  className,
  children,
}) {
  return (
    <div className={className}>
      {label ? (
        <div className="mb-2 flex items-center justify-between gap-4">
          <label htmlFor={htmlFor} className="text-sm font-medium text-ink-2">
            {label}
          </label>
          {labelAction}
        </div>
      ) : null}
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          className={cx(
            'animate-fade-in mt-2 flex items-start gap-1.5 text-sm text-error motion-reduce:animate-none',
          )}
          style={{ animationDuration: '0.3s' }}
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <div id={`${htmlFor}-hint`} className="mt-2 text-sm text-ink-3">
          {hint}
        </div>
      ) : null}
    </div>
  )
}
