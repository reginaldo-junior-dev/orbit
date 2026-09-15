import { LoaderCircle } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'
import Logo from '../ui/Logo'
import { useAuth } from '../../context/auth'

export default function RequireAuth({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-bg">
        <Logo />
        <LoaderCircle
          className="animate-spin h-5 w-5 text-accent motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span className="sr-only">Loading your workspace…</span>
      </div>
    )
  }

  if (status === 'guest') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
