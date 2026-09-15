import { useCallback, useMemo, useState } from 'react'
import { CircleAlert, FolderKanban, Plus, RotateCw } from 'lucide-react'
import ProjectCard from '../components/projects/ProjectCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FilterPills from '../components/ui/FilterPills'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { listProjects } from '../services/projectService'
import { listTasks } from '../services/taskService'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
]

function ProjectsSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading projects…</span>
      <div
        aria-hidden="true"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const fetchData = useCallback(
    () =>
      Promise.all([listProjects(), listTasks()]).then(([projects, tasks]) => ({
        projects,
        tasks,
      })),
    [],
  )
  const { data, status, error: loadError, retry } = useApiData(fetchData)
  const projects = useMemo(() => data?.projects ?? [], [data])
  const tasks = useMemo(() => data?.tasks ?? [], [data])
  const [statusFilter, setStatusFilter] = useState('ALL')

  const countsByProject = useMemo(() => {
    const map = {}
    for (const task of tasks) {
      if (!task.projectId) continue
      const entry = map[task.projectId] ?? { total: 0, done: 0 }
      entry.total += 1
      if (task.status === 'DONE') entry.done += 1
      map[task.projectId] = entry
    }
    return map
  }, [tasks])

  const visibleProjects = useMemo(() => {
    const list = projects.filter(
      (project) => statusFilter === 'ALL' || project.status === statusFilter,
    )
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [projects, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Projects
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Group related tasks and track progress at a glance.
          </p>
        </div>
        <Button href="/projects/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </Button>
      </div>

      {status === 'loading' ? <ProjectsSkeleton /> : null}

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
          <div className="flex flex-wrap items-center gap-2">
            <FilterPills
              options={STATUS_FILTERS}
              value={statusFilter}
              onChange={setStatusFilter}
              label="Filter by status"
            />
            {projects.length > 0 ? (
              <p className="ml-auto text-xs text-ink-3">
                Showing {visibleProjects.length} of {projects.length} projects
              </p>
            ) : null}
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              text="Create a project to group related tasks and keep your work organized."
            >
              <Button href="/projects/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create project
              </Button>
            </EmptyState>
          ) : visibleProjects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects match your filters"
              text="Try a different status filter to see more of your projects."
            >
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('ALL')}>
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project) => {
                const counts = countsByProject[project.id] ?? { total: 0, done: 0 }
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    taskCount={counts.total}
                    doneCount={counts.done}
                  />
                )
              })}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
