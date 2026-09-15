import { cx } from '../../lib/cx'

export default function Badge({ className, children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium tracking-wide text-ink-2',
        className,
      )}
    >
      {children}
    </span>
  )
}
