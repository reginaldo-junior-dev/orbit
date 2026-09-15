import { cx } from '../../lib/cx'

export default function Skeleton({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'animate-pulse rounded-lg bg-surface-2 motion-reduce:animate-none',
        className,
      )}
    />
  )
}
