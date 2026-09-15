import { apiFetch } from './api'

export function getMe() {
  return apiFetch('/users/me')
}

export function updateMe(user) {
  return apiFetch('/users/me', {
    method: 'PUT',
    body: user,
  })
}

export function changePassword(passwords) {
  return apiFetch('/users/me/password', {
    method: 'PATCH',
    body: passwords,
  })
}

export function deleteMe() {
  return apiFetch('/users/me', {
    method: 'DELETE',
  })
}
