import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  ListTodo,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react'
import TaskRow from '../components/tasks/TaskRow'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import Modal from '../components/ui/Modal'
import ProgressBar from '../components/ui/ProgressBar'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { formatDate } from '../lib/date'
import { PROJECT_STATUS, priorityWeight } from '../lib/status'
import { deleteProject, getProject } from '../services/projectService'
import { deleteTask, listTasks, taskToRequest, updateTask } from '../services/taskService'

function DetailsSkeleton() {
  return (
    <div role="status" className="space-y-6">
      <span className="sr-only">Loading project…</span>
      <div aria-hidden="true" className="space-y-5">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-9 w-64 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        </div>
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  )
}

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchData = useCallback(
    () =>
      Promise.all([getProject(id), listTasks()]).then(([project, tasks]) => ({
        project,
        tasks,
      })),
    [id],
  )
  const { data, status, error: loadError, retry, setData } = useApiData(fetchData)
  const project = data?.project ?? null
  const tasks = useMemo(() => data?.tasks ?? [], [data])

  const [updatingId, setUpdatingId] = useState(null)
  const [pendingDeleteTask, setPendingDeleteTask] = useState(null)
  const [deletingTask, setDeletingTask] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [deletingProject, setDeletingProject] = useState(false)
  const [actionError, setActionError] = useState(null)

  const projectTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.projectId === id)
        .sort(
          (a, b) =>
            Number(a.status === 'DONE') - Number(b.status === 'DONE') ||
            priorityWeight(a.priority) - priorityWeight(b.priority),
        ),
    [tasks, id],
  )

  const counts = useMemo(() => {
    const result = { total: 0, todo: 0, inProgress: 0, done: 0 }
    for (const task of projectTasks) {
      result.total += 1
      if (task.status === 'TODO') result.todo += 1
      if (task.status === 'IN_PROGRESS') result.inProgress += 1
      if (task.status === 'DONE') result.done += 1
    }
    return result
  }, [projectTasks])

  const percent = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0

  const handleTaskStatusChange = async (task, nextStatus) => {
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

  const confirmDeleteTask = async () => {
    if (!pendingDeleteTask || deletingTask) return
    setDeletingTask(true)
    setActionError(null)
    try {
      await deleteTask(pendingDeleteTask.id)
      setData((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== pendingDeleteTask.id),
      }))
      setPendingDeleteTask(null)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setDeletingTask(false)
    }
  }

  const confirmDeleteProject = async () => {
    if (deletingProject) return
    setDeletingProject(true)
    setActionError(null)
    try {
      await deleteProject(id)
      navigate('/projects', { replace: true })
    } catch (error) {
      setActionError(error.message)
      setDeleteProjectOpen(false)
      setDeletingProject(false)
    }
  }

  const notFound = loadError?.status === 404

  const closeDeleteTaskModal = useCallback(() => setPendingDeleteTask(null), [])
  const closeDeleteProjectModal = useCallback(() => setDeleteProjectOpen(false), [])

  return (
    <div className="space-y-6">
      {status === 'loading' ? <DetailsSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert">
          <EmptyState
            tone="error"
            icon={CircleAlert}
            title={notFound ? 'Project not found' : 'Something went wrong'}
            text={
              notFound
                ? 'This project may have been deleted or the link is incorrect.'
                : loadError?.message
            }
            className="border-solid border-error/30 bg-error/5"
          >
            {notFound ? (
              <Button href="/projects" variant="outline" size="sm">
                Back to projects
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={retry}>
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                Try again
              </Button>
            )}
          </EmptyState>
        </div>
      ) : null}

      {status === 'ready' ? (
        <>
          <div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:focus-ring"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to projects
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {project.name}
                  </h1>
                  <Chip meta={PROJECT_STATUS[project.status]} />
                </div>
                {project.description ? (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-2">
                    {project.description}
                  </p>
                ) : null}
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-3">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Created {project.createdAt ? formatDate(project.createdAt.slice(0, 10)) : '—'}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button href={`/tasks/new?project=${id}`}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add task
                </Button>
                <Button href={`/projects/${id}/edit`} variant="outline">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Edit
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteProjectOpen(true)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-3 transition-colors duration-200 hover:border-error/50 hover:text-error focus-visible:focus-ring"
                  aria-label="Delete project"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
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

          <section aria-label="Progress" className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Progress
                </h2>
                <p className="mt-1 text-xs text-ink-3">
                  {counts.total > 0
                    ? `${counts.done} of ${counts.total} tasks completed`
                    : 'No tasks in this project yet'}
                </p>
              </div>
              {counts.total > 0 ? (
                <p className="font-display text-3xl font-semibold tracking-tight text-ink">
                  {percent}%
                </p>
              ) : null}
            </div>
            <ProgressBar value={percent} className="mt-4" label={`${project.name} is ${percent}% complete`} />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-surface-2 px-3 py-3 text-center">
                <p className="font-display text-xl font-semibold tracking-tight text-ink">
                  {counts.todo}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">To do</p>
              </div>
              <div className="rounded-xl bg-surface-2 px-3 py-3 text-center">
                <p className="font-display text-xl font-semibold tracking-tight text-ink">
                  {counts.inProgress}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">In progress</p>
              </div>
              <div className="rounded-xl bg-surface-2 px-3 py-3 text-center">
                <p className="font-display text-xl font-semibold tracking-tight text-ink">
                  {counts.done}
                </p>
                <p className="mt-0.5 text-xs text-ink-3">Done</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="project-tasks-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                id="project-tasks-heading"
                className="font-display text-lg font-semibold tracking-tight text-ink"
              >
                Tasks
              </h2>
              <Button href={`/tasks/new?project=${id}`} variant="outline" size="sm">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add task
              </Button>
            </div>
            <div className="mt-4">
              {projectTasks.length === 0 ? (
                <EmptyState
                  icon={ListTodo}
                  title="No tasks in this project yet"
                  text="Add the first task to start tracking progress."
                >
                  <Button href={`/tasks/new?project=${id}`} size="sm">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add task
                  </Button>
                </EmptyState>
              ) : (
                <ul className="space-y-2.5">
                  {projectTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      busy={updatingId === task.id}
                      onStatusChange={handleTaskStatusChange}
                      onDelete={setPendingDeleteTask}
                    />
                  ))}
                </ul>
              )}
            </div>
          </section>

          <Modal
            open={Boolean(pendingDeleteTask)}
            onClose={closeDeleteTaskModal}
            title="Delete task"
            description={
              pendingDeleteTask
                ? `"${pendingDeleteTask.title}" will be permanently removed. This action cannot be undone.`
                : undefined
            }
            footer={
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setPendingDeleteTask(null)}
                  disabled={deletingTask}
                >
                  Cancel
                </Button>
                <Button variant="danger" size="md" onClick={confirmDeleteTask} disabled={deletingTask}>
                  {deletingTask ? (
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

          <Modal
            open={deleteProjectOpen}
            onClose={closeDeleteProjectModal}
            title="Delete project"
            description={
              project
                ? `"${project.name}" will be permanently removed. This action cannot be undone.`
                : undefined
            }
            footer={
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setDeleteProjectOpen(false)}
                  disabled={deletingProject}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={confirmDeleteProject}
                  disabled={deletingProject}
                >
                  {deletingProject ? (
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
                      Delete project
                    </>
                  )}
                </Button>
              </>
            }
          />
        </>
      ) : null}
    </div>
  )
}
