import { cx } from '../../lib/cx'
import Field from './Field'

export default function Input({
  label,
  labelAction,
  hint,
  error,
  id,
  leftIcon,
  rightSlot,
  className,
  ...props
}) {
  return (
    <Field label={label} labelAction={labelAction} htmlFor={id} error={error} hint={hint}>
      <div className="relative">
        {leftIcon ? (
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cx(
            'h-12 w-full rounded-xl border bg-surface-2 px-4 text-sm text-ink transition-colors duration-200 placeholder:text-ink-3 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50',
            leftIcon ? 'pl-11' : '',
            rightSlot ? 'pr-13' : '',
            error ? 'border-error/60 hover:border-error/80' : 'border-line hover:border-line-strong',
            className,
          )}
          {...props}
        />
        {rightSlot}
      </div>
    </Field>
  )
}
