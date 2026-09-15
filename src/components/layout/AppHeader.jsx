import { Menu, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const SECTION_LABELS = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  projects: 'Projects',
  goals: 'Goals',
  profile: 'Profile',
  settings: 'Settings',
  admin: 'Admin',
}

function sectionLabel(pathname) {
  const segment = pathname.split('/')[1] ?? ''
  return SECTION_LABELS[segment] ?? 'Orbit'
}

function todayLabel() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date())
}

export default function AppHeader({ menuOpen, onMenuToggle, menuButtonRef }) {
  const { pathname } = useLocation()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          ref={menuButtonRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-2 transition-colors duration-200 hover:bg-surface hover:text-ink focus-visible:focus-ring lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="app-drawer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={onMenuToggle}
        >
          {menuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <h1 className="min-w-0 truncate font-display text-lg font-semibold tracking-tight text-ink">
          {sectionLabel(pathname)}
        </h1>

        <p className="ml-auto hidden text-sm text-ink-3 sm:block" aria-hidden="true">
          {todayLabel()}
        </p>
      </div>
    </header>
  )
}
