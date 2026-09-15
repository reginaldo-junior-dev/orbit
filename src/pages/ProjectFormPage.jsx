import { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CircleAlert, RotateCw } from 'lucide-react'
import ProjectForm from '../components/projects/ProjectForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { createProject, getProject, updateProject } from '../services/projectService'

function FormSkeleton() {
  return (
    <div role="status" className="space-y-5 rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <span className="sr-only">Loading form…</span>
      <div aria-hidden="true" className="space-y-5">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="flex justify-end gap-3">
          <Skeleton className="h-11 w-24 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const fetchData = useCallback(() => (isEdit ? getProject(id) : Promise.resolve(null)), [id, isEdit])
  const { data: project, status, error: loadError, retry } = useApiData(fetchData)

  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleSubmit = async (request) => {
    if (isEdit) {
      await updateProject(id, request)
    } else {
      await createProject(request)
    }
  }

  const handleSuccess = () => {
    const destination = isEdit ? `/projects/${id}` : '/projects'
    timerRef.current = setTimeout(() => navigate(destination, { replace: true }), 1200)
  }

  const notFound = loadError?.status === 404

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          to={isEdit ? `/projects/${id}` : '/projects'}
          className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:focus-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {isEdit ? 'Back to project' : 'Back to projects'}
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {isEdit ? 'Edit project' : 'New project'}
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          {isEdit
            ? 'Update the details of your project.'
            : 'Create a project to group related tasks.'}
        </p>
      </div>

      {status === 'loading' ? <FormSkeleton /> : null}

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
        <ProjectForm
          key={project?.id ?? 'new'}
          initial={project}
          submitLabel={isEdit ? 'Save changes' : 'Create project'}
          successMessage={
            isEdit
              ? 'Project updated — heading back to the project…'
              : 'Project created — heading to your projects…'
          }
          onSubmit={handleSubmit}
          onCancel={() => navigate(isEdit ? `/projects/${id}` : '/projects')}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  )
}
