import { apiFetch } from './api'

export function listTasks() {
  return apiFetch('/tasks')
}

export function getTask(id) {
  return apiFetch(`/tasks/${id}`)
}

export function createTask(task) {
  return apiFetch('/tasks', {
    method: 'POST',
    body: task,
  })
}

export function updateTask(id, task) {
  return apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: task,
  })
}

export function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  })
}

export function taskToRequest(task, status = task.status) {
  return {
    title: task.title,
    description: task.description,
    status,
    priority: task.priority,
    dueDate: task.dueDate,
    projectId: task.projectId,
  }
}
