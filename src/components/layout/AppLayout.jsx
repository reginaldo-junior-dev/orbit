import { useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import useFocusTrap from '../../hooks/useFocusTrap'
import { cx } from '../../lib/cx'
import AppHeader from './AppHeader'
import Sidebar from './Sidebar'

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const drawerRef = useRef(null)
  const { pathname } = useLocation()
  const [lastPathname, setLastPathname] = useState(pathname)

  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

  const closeDrawer = () => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  useFocusTrap({ ref: drawerRef, active: menuOpen, onClose: closeDrawer })

  return (
    <div className="flex min-h-svh bg-bg">
      <a
        href="#app-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block" aria-label="App navigation">
        <Sidebar />
      </aside>

      <div
        className={cx(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
        )}
        aria-hidden="true"
        onClick={closeDrawer}
      />

      <div
        id="app-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        className={cx(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transition-transform duration-300 ease-out motion-reduce:transition-none lg:hidden',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar onNavigate={closeDrawer} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <AppHeader
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          menuButtonRef={menuButtonRef}
        />
        <main
          id="app-main"
          className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10"
        >
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
