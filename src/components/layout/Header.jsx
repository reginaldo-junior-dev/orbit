import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cx } from '../../lib/cx'
import useFocusTrap from '../../hooks/useFocusTrap'
import Button from '../ui/Button'
import Container from '../ui/Container'
import Logo from '../ui/Logo'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  useFocusTrap({ ref: menuRef, active: menuOpen, onClose: closeMenu })

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled || menuOpen
          ? 'border-b border-line bg-bg/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface hover:text-ink focus-visible:focus-ring"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href="/login" variant="ghost" size="sm" className="px-4">
            Log in
          </Button>
          <Button href="#pricing" size="sm">
            Get started
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface hover:text-ink focus-visible:focus-ring lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </Container>

      <div
        id="mobile-nav"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        className={cx(
          'fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-bg/95 px-5 pt-6 pb-8 backdrop-blur-md transition-opacity duration-300 sm:top-[4.5rem] lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-4 py-3.5 font-display text-2xl font-medium text-ink transition-colors hover:bg-surface focus-visible:focus-ring"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-3">
          <Button href="/login" variant="outline" size="lg" className="w-full">
            Log in
          </Button>
          <Button href="#pricing" size="lg" className="w-full">
            Get started
          </Button>
        </div>
      </div>
    </header>
  )
}
