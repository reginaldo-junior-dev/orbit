import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function GuestOnly({ children }) {
  const { status } = useAuth()

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }
  if (status === 'loading') {
    return null
  }
  return children
}
