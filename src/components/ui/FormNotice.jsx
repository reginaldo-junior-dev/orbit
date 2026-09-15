import { CircleAlert, CircleCheck } from 'lucide-react'
import { cx } from '../../lib/cx'

export default function FormNotice({ tone = 'success', className, children }) {
  const success = tone === 'success'
  const Icon = success ? CircleCheck : CircleAlert
  return (
    <p
      role={success ? 'status' : 'alert'}
      className={cx(
        'animate-fade-in flex items-start gap-2.5 rounded-xl border p-4 text-sm leading-relaxed text-ink-2 motion-reduce:animate-none',
        success ? 'border-success/40 bg-success/10' : 'border-error/40 bg-error/10',
        className,
      )}
      style={{ animationDuration: '0.3s' }}
    >
      <Icon
        className={cx('mt-0.5 h-4 w-4 shrink-0', success ? 'text-success' : 'text-error')}
        aria-hidden="true"
      />
      {children}
    </p>
  )
}
