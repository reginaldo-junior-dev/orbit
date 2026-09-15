import { apiFetch } from './api'

export function listUsers() {
  return apiFetch('/admin/users')
}
