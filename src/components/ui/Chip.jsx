import { cx } from '../../lib/cx'

export default function Chip({ meta, className }) {
  if (!meta) return null
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-2',
        className,
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  )
}
