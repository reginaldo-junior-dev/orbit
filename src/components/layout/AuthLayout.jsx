import AuthVisual from '../shared/AuthVisual'

export default function AuthLayout({ children, visual = <AuthVisual /> }) {
  return (
    <div className="grid min-h-svh bg-bg lg:grid-cols-2">
      <a
        href="#auth-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <div className="flex flex-col">
        <main
          id="auth-main"
          className="flex w-full flex-1 flex-col items-center justify-center px-5 py-8 sm:px-10 sm:py-10"
        >
          <div className="w-full max-w-sm">{children}</div>
          <p className="mt-8 w-full text-center text-xs text-ink-3">
            © 2026 Orbit. All rights reserved.
          </p>
        </main>
      </div>
      <aside
        className="relative hidden overflow-hidden border-l border-line lg:block"
        aria-label="Orbit illustration"
      >
        {visual}
      </aside>
    </div>
  )
}
