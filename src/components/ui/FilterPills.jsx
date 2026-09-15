import { cx } from '../../lib/cx'

export default function FilterPills({ options, value, onChange, label, className }) {
  return (
    <div className={cx('flex flex-wrap items-center gap-2', className)} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cx(
            'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:focus-ring',
            value === option.value
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-line text-ink-2 hover:border-line-strong hover:text-ink',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
