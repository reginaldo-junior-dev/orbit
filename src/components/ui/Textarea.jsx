import { cx } from '../../lib/cx'
import Field from './Field'

export default function Textarea({ label, labelAction, hint, error, id, className, ...props }) {
  return (
    <Field label={label} labelAction={labelAction} htmlFor={id} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cx(
          'w-full resize-none rounded-xl border bg-surface-2 px-4 py-3 text-sm text-ink transition-colors duration-200 placeholder:text-ink-3 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-50',
          error ? 'border-error/60 hover:border-error/80' : 'border-line hover:border-line-strong',
          className,
        )}
        {...props}
      />
    </Field>
  )
}
