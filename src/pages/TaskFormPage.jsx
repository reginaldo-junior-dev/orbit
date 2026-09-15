import { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CircleAlert, RotateCw } from 'lucide-react'
import TaskForm from '../components/tasks/TaskForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { listProjects } from '../services/projectService'
import { createTask, getTask, updateTask } from '../services/taskService'

function FormSkeleton() {
  return (
    <div role="status" className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <span className="sr-only">Loading form…</span>
      <div aria-hidden="true" className="space-y-5">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
        <div className="flex justify-end gap-3">
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function TaskFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [searchParams] = useSearchParams()
  const projectParam = searchParams.get('project')

  const fetchData = useCallback(() => {
    const projectsPromise = listProjects()
    if (!isEdit) return projectsPromise.then((list) => [null, list])
    return Promise.all([getTask(id), projectsPromise])
  }, [id, isEdit])
  const { data, status, error: loadError, retry } = useApiData(fetchData)
  const [task, projects] = data ?? [null, []]

  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleSubmit = async (request) => {
    if (isEdit) {
      await updateTask(id, request)
    } else {
      await createTask(request)
    }
  }

  const handleSuccess = () => {
    timerRef.current = setTimeout(() => navigate('/tasks', { replace: true }), 1200)
  }

  const notFound = loadError?.status === 404

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:focus-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to tasks
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {isEdit ? 'Edit task' : 'New task'}
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          {isEdit
            ? 'Update the details of your task.'
            : 'Create a new task and organize your day.'}
        </p>
      </div>

      {status === 'loading' ? <FormSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert">
          <EmptyState
            tone="error"
            icon={CircleAlert}
            title={notFound ? 'Task not found' : 'Something went wrong'}
            text={
              notFound
                ? 'This task may have been deleted or the link is incorrect.'
                : loadError?.message
            }
            className="border-solid border-error/30 bg-error/5"
          >
            {notFound ? (
              <Button href="/tasks" variant="outline" size="sm">
                Back to tasks
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
        <TaskForm
          key={task?.id ?? `new${projectParam ? `-${projectParam}` : ''}`}
          initial={task ?? (projectParam ? { projectId: projectParam } : null)}
          projects={projects}
          submitLabel={isEdit ? 'Save changes' : 'Create task'}
          successMessage={
            isEdit
              ? 'Task updated — heading back to your tasks…'
              : 'Task created — heading to your tasks…'
          }
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tasks')}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  )
}
