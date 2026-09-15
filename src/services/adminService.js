import { apiFetch } from './api'

export function listUsers() {
  return apiFetch('/admin/users')
}

export function updateUser(id, user) {
  return apiFetch(`/admin/users/${id}`, {
    method: 'PUT',
    body: user,
  })
}

export function deleteUser(id) {
  return apiFetch(`/admin/users/${id}`, {
    method: 'DELETE',
  })
}
