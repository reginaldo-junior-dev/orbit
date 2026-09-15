export const PRIORITY = {
  LOW: { label: 'Low', dot: 'bg-ink-3' },
  MEDIUM: { label: 'Medium', dot: 'bg-amber' },
  HIGH: { label: 'High', dot: 'bg-error' },
}

export const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 }

export const TASK_STATUS = {
  TODO: { label: 'To do', dot: 'bg-ink-3' },
  IN_PROGRESS: { label: 'In progress', dot: 'bg-accent' },
  DONE: { label: 'Done', dot: 'bg-success' },
}

export const PROJECT_STATUS = {
  ACTIVE: { label: 'Active', dot: 'bg-accent' },
  COMPLETED: { label: 'Completed', dot: 'bg-success' },
  ARCHIVED: { label: 'Archived', dot: 'bg-ink-3' },
}

export const GOAL_STATUS = {
  ACTIVE: { label: 'Active', dot: 'bg-accent' },
  COMPLETED: { label: 'Completed', dot: 'bg-success' },
  ARCHIVED: { label: 'Archived', dot: 'bg-ink-3' },
}

export const ROLE = {
  ADMIN: { label: 'Admin', dot: 'bg-accent' },
  USER: { label: 'User', dot: 'bg-ink-3' },
}

export function priorityWeight(priority) {
  return PRIORITY_ORDER[priority] ?? 3
}
