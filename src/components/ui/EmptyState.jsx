import { cx } from '../../lib/cx'

const tones = {
  accent: 'bg-accent/10 text-accent',
  error: 'bg-error/10 text-error',
}

export default function EmptyState({ icon: Icon, tone = 'accent', title, text, className, children }) {
  return (
    <div
      className={cx(
        'flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface/50 px-6 py-10 text-center',
        className,
      )}
    >
      {Icon ? (
        <span className={cx('flex h-11 w-11 items-center justify-center rounded-full', tones[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
      <p className="mt-4 text-sm font-semibold text-ink">{title}</p>
      {text ? <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-ink-3">{text}</p> : null}
      {children ? <div className="mt-5 flex justify-center">{children}</div> : null}
    </div>
  )
}
