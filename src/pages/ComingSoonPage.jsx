import { useLocation } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const SECTION_LABELS = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  projects: 'Projects',
  goals: 'Goals',
  profile: 'Profile',
  settings: 'Settings',
  admin: 'Admin',
}

export default function ComingSoonPage() {
  const { pathname } = useLocation()
  const segment = pathname.split('/')[1] ?? ''
  const label = SECTION_LABELS[segment] ?? 'Orbit'

  return (
    <div className="animate-fade-in flex min-h-[60svh] flex-col items-center justify-center text-center motion-reduce:animate-none">
      <Badge>In development</Badge>
      <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {label}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">
        This area is part of the next stages of the Orbit build and will be connected to
        the API soon.
      </p>
      {segment !== 'dashboard' ? (
        <Button href="/dashboard" variant="outline" size="md" className="mt-8">
          Back to dashboard
        </Button>
      ) : null}
    </div>
  )
}
