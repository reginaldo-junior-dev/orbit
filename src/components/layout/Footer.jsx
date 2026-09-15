import Container from '../ui/Container'
import Logo from '../ui/Logo'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-ink-3">
              The personal productivity platform that keeps your tasks, habits and
              focus in one calm orbit.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-ink">
                {column.title}
              </h3>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block rounded-sm py-1.5 text-sm text-ink-3 transition-colors hover:text-ink focus-visible:focus-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-sm text-ink-3">© 2026 Orbit. All rights reserved.</p>
          <p className="text-sm text-ink-3">
            Made for deep work <span aria-hidden="true">·</span> Designed in orbit
          </p>
        </div>
      </Container>
    </footer>
  )
}
