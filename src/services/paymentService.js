import { apiFetch } from './api'

export function createPreference(plan, billingCycle) {
  return apiFetch('/payments/preference', {
    method: 'POST',
    body: { plan, billingCycle },
  })
}

export function getPayment(id) {
  return apiFetch(`/payments/${id}`)
}
