import { Check, CircleAlert } from 'lucide-react'
import { cx } from '../../lib/cx'

export default function Checkbox({
  id,
  checked,
  onChange,
  disabled,
  error,
  children,
  ...props
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cx(
          'group flex cursor-pointer items-start gap-3 select-none',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className={cx(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 peer-focus-visible:focus-ring',
            error
              ? 'border-error/60'
              : 'border-line bg-surface-2 peer-hover:border-line-strong',
            checked && 'border-accent bg-accent',
          )}
        >
          {checked ? <Check className="h-3.5 w-3.5 text-bg" strokeWidth={3} /> : null}
        </span>
        <span className="text-sm leading-relaxed text-ink-2">{children}</span>
      </label>
      {error ? (
        <p
          id={`${id}-error`}
          className="animate-fade-in mt-2 flex items-start gap-1.5 pl-8 text-sm text-error motion-reduce:animate-none"
          style={{ animationDuration: '0.3s' }}
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}
