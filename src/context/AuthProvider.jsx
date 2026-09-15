import { useCallback, useEffect, useState } from 'react'
import { apiFetch, resetCsrf } from '../services/api'
import { getMe } from '../services/userService'
import { AuthContext } from './auth'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let active = true
    getMe()
      .then((me) => {
        if (active) {
          setUser(me)
          setStatus('authenticated')
        }
      })
      .catch(() => {
        if (active) {
          setUser(null)
          setStatus('guest')
        }
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null)
      setStatus('guest')
    }
    window.addEventListener('orbit:unauthorized', onUnauthorized)
    return () => window.removeEventListener('orbit:unauthorized', onUnauthorized)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiFetch('/logout', { method: 'POST' })
    } catch {
      // Local session is cleared regardless of the request result.
    }
    resetCsrf()
    setUser(null)
    setStatus('guest')
  }, [])

  const signIn = useCallback(async () => {
    try {
      const me = await getMe()
      setUser(me)
      setStatus('authenticated')
      return true
    } catch {
      setUser(null)
      setStatus('guest')
      return false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, logout, setUser, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}
