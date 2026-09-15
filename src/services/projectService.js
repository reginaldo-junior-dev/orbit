import { apiFetch } from './api'

export function listProjects() {
  return apiFetch('/projects')
}

export function getProject(id) {
  return apiFetch(`/projects/${id}`)
}

export function createProject(project) {
  return apiFetch('/projects', {
    method: 'POST',
    body: project,
  })
}

export function updateProject(id, project) {
  return apiFetch(`/projects/${id}`, {
    method: 'PUT',
    body: project,
  })
}

export function deleteProject(id) {
  return apiFetch(`/projects/${id}`, {
    method: 'DELETE',
  })
}
