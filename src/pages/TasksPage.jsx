import { useCallback, useMemo, useState } from 'react'
import {
  CircleAlert,
  ListTodo,
  LoaderCircle,
  Plus,
  RotateCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import TaskRow from '../components/tasks/TaskRow'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FilterPills from '../components/ui/FilterPills'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import Select from '../components/ui/Select'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { isOverdue, todayIso } from '../lib/date'
import { priorityWeight } from '../lib/status'
import { listProjects } from '../services/projectService'
import { deleteTask, listTasks, taskToRequest, updateTask } from '../services/taskService'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'DONE', label: 'Done' },
]

const DATE_FILTERS = [
  { value: 'ALL', label: 'All dates' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'TODAY', label: 'Today' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'NONE', label: 'No date' },
]

const SORT_OPTIONS = [
  { value: 'DUE', label: 'Due date' },
  { value: 'PRIORITY', label: 'Priority' },
  { value: 'CREATED', label: 'Recently created' },
  { value: 'TITLE', label: 'Title A–Z' },
]

function TasksSkeleton() {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">Loading tasks…</span>
      <div aria-hidden="true" className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
      <ul aria-hidden="true" className="space-y-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index}>
            <Skeleton className="h-28 rounded-xl" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TasksPage() {
  const fetchData = useCallback(
    () =>
      Promise.all([listTasks(), listProjects()]).then(([tasks, projects]) => ({
        tasks,
        projects,
      })),
    [],
  )
  const { data, status, error: loadError, retry, setData } = useApiData(fetchData)
  const tasks = useMemo(() => data?.tasks ?? [], [data])
  const projects = useMemo(() => data?.projects ?? [], [data])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [projectFilter, setProjectFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('DUE')

  const [updatingId, setUpdatingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  const closeDeleteModal = useCallback(() => setPendingDelete(null), [])

  const today = todayIso()

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = tasks.filter((task) => {
      if (statusFilter !== 'ALL' && task.status !== statusFilter) return false
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) return false
      if (projectFilter !== 'ALL' && task.projectId !== projectFilter) return false
      if (dateFilter !== 'ALL') {
        if (dateFilter === 'NONE' && task.dueDate) return false
        if (dateFilter === 'TODAY' && task.dueDate !== today) return false
        if (dateFilter === 'OVERDUE' && !isOverdue(task.dueDate)) return false
        if (dateFilter === 'UPCOMING' && (!task.dueDate || task.dueDate <= today)) return false
      }
      if (query) {
        const haystack = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    return list.sort((a, b) => {
      if (sortBy === 'TITLE') return (a.title ?? '').localeCompare(b.title ?? '')
      if (sortBy === 'CREATED') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'PRIORITY') {
        return (
          priorityWeight(a.priority) - priorityWeight(b.priority) ||
          (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')
        )
      }
      return (
        (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') ||
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    })
  }, [tasks, search, statusFilter, priorityFilter, projectFilter, dateFilter, sortBy, today])

  const projectNameOf = (task) =>
    task.projectId ? projects.find((project) => project.id === task.projectId)?.name : null

  const handleStatusChange = async (task, nextStatus) => {
    if (updatingId) return
    setUpdatingId(task.id)
    setActionError(null)
    try {
      const updated = await updateTask(task.id, taskToRequest(task, nextStatus))
      setData((current) => ({
        ...current,
        tasks: current.tasks.map((item) => (item.id === updated.id ? updated : item)),
      }))
    } catch (error) {
      setActionError(error.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete || deleting) return
    setDeleting(true)
    setActionError(null)
    try {
      await deleteTask(pendingDelete.id)
      setData((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== pendingDelete.id),
      }))
      setPendingDelete(null)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setPriorityFilter('ALL')
    setProjectFilter('ALL')
    setDateFilter('ALL')
    setSortBy('DUE')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Tasks
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Organize everything that needs to get done.
          </p>
        </div>
        <Button href="/tasks/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New task
        </Button>
      </div>

      {status === 'loading' ? <TasksSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert">
          <EmptyState
            tone="error"
            icon={CircleAlert}
            title="Something went wrong"
            text={loadError?.message}
            className="border-solid border-error/30 bg-error/5"
          >
            <Button variant="outline" size="sm" onClick={retry}>
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              Try again
            </Button>
          </EmptyState>
        </div>
      ) : null}

      {status === 'ready' ? (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="min-w-48 flex-1">
                <Input
                  id="tasks-search"
                  aria-label="Search tasks"
                  placeholder="Search tasks…"
                  leftIcon={<Search className="h-4 w-4" />}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <Select
                aria-label="Filter by priority"
                className="min-w-36 w-auto"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="ALL">All priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
              <Select
                aria-label="Filter by project"
                className="min-w-40 w-auto"
                value={projectFilter}
                onChange={(event) => setProjectFilter(event.target.value)}
              >
                <option value="ALL">All projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Filter by date"
                className="min-w-32 w-auto"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              >
                {DATE_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Sort tasks"
                className="min-w-40 w-auto"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <FilterPills
                options={STATUS_FILTERS}
                value={statusFilter}
                onChange={setStatusFilter}
                label="Filter by status"
              />
              {tasks.length > 0 ? (
                <p className="ml-auto text-xs text-ink-3">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </p>
              ) : null}
            </div>
          </div>

          {actionError ? (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-error/40 bg-error/10 px-4 py-3"
            >
              <p className="flex items-start gap-2 text-sm text-ink-2">
                <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
                {actionError}
              </p>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink focus-visible:focus-ring"
                aria-label="Dismiss error"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          {tasks.length === 0 ? (
            <EmptyState
              icon={ListTodo}
              title="No tasks yet"
              text="Create your first task and start organizing your day."
            >
              <Button href="/tasks/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create task
              </Button>
            </EmptyState>
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No tasks match your filters"
              text="Try adjusting your search or filters to find what you're looking for."
            >
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  projectName={projectNameOf(task)}
                  busy={updatingId === task.id}
                  onStatusChange={handleStatusChange}
                  onDelete={setPendingDelete}
                />
              ))}
            </ul>
          )}
        </>
      ) : null}

      <Modal
        open={Boolean(pendingDelete)}
        onClose={closeDeleteModal}
        title="Delete task"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be permanently removed. This action cannot be undone.`
            : undefined
        }
        footer={
          <>
            <Button variant="outline" size="md" onClick={closeDeleteModal} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <LoaderCircle
                    className="animate-spin h-4 w-4 motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete task
                </>
              )}
            </Button>
          </>
        }
      />
    </div>
  )
}
