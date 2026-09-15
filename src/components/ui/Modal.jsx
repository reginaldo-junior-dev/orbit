import { useId, useRef } from 'react'
import { X } from 'lucide-react'
import { cx } from '../../lib/cx'
import useFocusTrap from '../../hooks/useFocusTrap'

export default function Modal({ open, onClose, title, description, children, footer }) {
  const titleId = useId()
  const panelRef = useRef(null)

  useFocusTrap({ ref: panelRef, active: open, onClose, preferredSelector: '[data-modal-close]' })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cx(
          'animate-fade-in relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl motion-reduce:animate-none',
        )}
        style={{ animationDuration: '0.25s' }}
      >
        <button
          type="button"
          data-modal-close
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-ink focus-visible:focus-ring"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <h2 id={titleId} className="pr-10 font-display text-xl font-semibold tracking-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-ink-2">{description}</p>
        ) : null}

        {children ? <div className="mt-5">{children}</div> : null}

        {footer ? <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div> : null}
      </div>
    </div>
  )
}
