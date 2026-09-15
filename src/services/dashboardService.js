import { apiFetch } from './api'

export function getDashboard() {
  return apiFetch('/dashboard')
}
