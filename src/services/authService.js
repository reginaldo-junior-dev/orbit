import { apiFetch } from './api'

export function login(email, password) {
  return apiFetch('/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function register(name, email, password) {
  return apiFetch('/register', {
    method: 'POST',
    body: { name, email, password },
  })
}
