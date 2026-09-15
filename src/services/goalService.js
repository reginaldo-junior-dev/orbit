import { apiFetch } from './api'

export function listGoals() {
  return apiFetch('/goals')
}

export function getGoal(id) {
  return apiFetch(`/goals/${id}`)
}

export function createGoal(goal) {
  return apiFetch('/goals', {
    method: 'POST',
    body: goal,
  })
}

export function updateGoal(id, goal) {
  return apiFetch(`/goals/${id}`, {
    method: 'PUT',
    body: goal,
  })
}
