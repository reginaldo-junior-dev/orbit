import { useEffect } from 'react'

export default function useFocusTrap({ ref, active, onClose, preferredSelector }) {
  useEffect(() => {
    if (!active) return

    const focusables = () =>
      ref.current?.querySelectorAll('a[href], button:not([disabled]), select, input') ?? []

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previous = document.activeElement
    const preferred = preferredSelector ? ref.current?.querySelector(preferredSelector) : null
    ;(preferred ?? focusables()[0])?.focus()
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [active, onClose, preferredSelector, ref])
}
