import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CircleAlert,
  CircleCheck,
  FolderKanban,
  ListTodo,
  Plus,
  RotateCw,
  Target,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Chip from '../components/ui/Chip'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import { useAuth } from '../context/auth'
import useApiData from '../hooks/useApiData'
import { cx } from '../lib/cx'
import { formatDate, todayIso } from '../lib/date'
import {
  GOAL_STATUS,
  PRIORITY,
  PROJECT_STATUS,
  TASK_STATUS,
  priorityWeight,
} from '../lib/status'
import { getDashboard } from '../services/dashboardService'
import { listGoals } from '../services/goalService'
import { listProjects } from '../services/projectService'
import { listTasks } from '../services/taskService'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function fullDateLabel() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

function SectionHeading({ id, title, to }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 id={id} className="font-display text-lg font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <Link
        to={to}
        className="inline-flex items-center gap-1 rounded-md py-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover focus-visible:focus-ring"
      >
        View all
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading your dashboard…</span>
      <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-40 rounded-2xl" />
        ))}
      </div>
      <div aria-hidden="true" className="mt-6 grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-2xl xl:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-60 rounded-2xl" />
          <Skeleton className="h-60 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, sub, value, icon: Icon, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40 focus-visible:focus-ring"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
        </span>
        <ArrowRight
          className="h-4 w-4 text-ink-3 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink-2">{label}</p>
      <p className="mt-0.5 text-xs text-ink-3">{sub}</p>
    </Link>
  )
}

function TaskRow({ task, projectName }) {
  const status = TASK_STATUS[task.status]
  const done = task.status === 'DONE'
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-line-strong">
      <span
        className={cx('h-2 w-2 shrink-0 rounded-full', status?.dot ?? 'bg-ink-3')}
        title={status?.label}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cx(
            'truncate text-sm font-medium',
            done ? 'text-ink-3 line-through' : 'text-ink',
          )}
        >
          {task.title}
        </p>
        {projectName ? <p className="mt-0.5 truncate text-xs text-ink-3">{projectName}</p> : null}
      </div>
      <Chip meta={PRIORITY[task.priority]} className="hidden sm:inline-flex" />
      <span className="hidden shrink-0 text-xs text-ink-3 sm:block">Today</span>
    </li>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  const fetchData = useCallback(
    () =>
      Promise.all([getDashboard(), listTasks(), listProjects(), listGoals()]).then(
        ([summary, tasks, projects, goals]) => ({ summary, tasks, projects, goals }),
      ),
    [],
  )
  const { data, status, error: loadError, retry } = useApiData(fetchData)

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? ''

  const tasks = data?.tasks ?? []
  const projects = data?.projects ?? []
  const goals = data?.goals ?? []
  const summary = data?.summary

  const today = todayIso()
  const todaysTasks = tasks
    .filter((task) => task.dueDate === today)
    .sort(
      (a, b) =>
        Number(a.status === 'DONE') - Number(b.status === 'DONE') ||
        priorityWeight(a.priority) - priorityWeight(b.priority),
    )

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const recentGoals = [...goals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const projectNameOf = (task) =>
    task.projectId ? projects.find((project) => project.id === task.projectId)?.name : null

  const taskCountOf = (project) => tasks.filter((task) => task.projectId === project.id).length

  const summaryCards = [
    {
      key: 'tasks',
      label: 'Tasks',
      value: summary?.tasks?.total ?? 0,
      sub: `${summary?.tasks?.todo ?? 0} to do`,
      icon: ListTodo,
      to: '/tasks',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: summary?.tasks?.done ?? 0,
      sub: `of ${summary?.tasks?.total ?? 0} tasks`,
      icon: CircleCheck,
      to: '/tasks',
    },
    {
      key: 'projects',
      label: 'Projects',
      value: summary?.projects?.total ?? 0,
      sub: `${summary?.projects?.active ?? 0} active`,
      icon: FolderKanban,
      to: '/projects',
    },
    {
      key: 'goals',
      label: 'Goals',
      value: summary?.goals?.total ?? 0,
      sub: `${summary?.goals?.active ?? 0} active`,
      icon: Target,
      to: '/goals',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {greeting()}
            {firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Here&apos;s what is happening with your productivity.
          </p>
          <p className="mt-1 text-xs text-ink-3">{fullDateLabel()}</p>
        </div>
        <Button href="/tasks/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New task
        </Button>
      </div>

      {status === 'loading' ? <DashboardSkeleton /> : null}

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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map(({ key, ...card }) => (
              <SummaryCard key={key} {...card} />
            ))}
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-3">
            <section aria-labelledby="today-heading" className="xl:col-span-2">
              <SectionHeading id="today-heading" title="Today's tasks" to="/tasks" />
              <div className="mt-4">
                {todaysTasks.length === 0 ? (
                  <EmptyState
                    icon={CalendarDays}
                    title="No tasks due today"
                    text="Enjoy the calm, or plan ahead — create a task and start organizing your day."
                  >
                    <Button href="/tasks/new" variant="outline" size="sm">
                      Create task
                    </Button>
                  </EmptyState>
                ) : (
                  <ul className="space-y-2.5">
                    {todaysTasks.slice(0, 5).map((task) => (
                      <TaskRow key={task.id} task={task} projectName={projectNameOf(task)} />
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <div className="space-y-6">
              <section aria-labelledby="projects-heading">
                <SectionHeading id="projects-heading" title="Recent projects" to="/projects" />
                <div className="mt-4">
                  {recentProjects.length === 0 ? (
                    <EmptyState
                      icon={FolderKanban}
                      title="No projects yet"
                      text="Create a project to group related tasks and keep your work organized."
                    >
                      <Button href="/projects/new" variant="outline" size="sm">
                        Create project
                      </Button>
                    </EmptyState>
                  ) : (
                    <ul className="space-y-2.5">
                      {recentProjects.map((project) => (
                        <li
                          key={project.id}
                          className="rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-line-strong"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-ink">{project.name}</p>
                            <Chip meta={PROJECT_STATUS[project.status]} />
                          </div>
                          {project.description ? (
                            <p className="mt-1 line-clamp-1 text-xs text-ink-3">
                              {project.description}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs text-ink-3">
                            {taskCountOf(project)}{' '}
                            {taskCountOf(project) === 1 ? 'task' : 'tasks'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section aria-labelledby="goals-heading">
                <SectionHeading id="goals-heading" title="Goals" to="/goals" />
                <div className="mt-4">
                  {recentGoals.length === 0 ? (
                    <EmptyState
                      icon={Target}
                      title="No goals yet"
                      text="Set a goal to give your work a clear direction."
                    >
                      <Button href="/goals/new" variant="outline" size="sm">
                        Create goal
                      </Button>
                    </EmptyState>
                  ) : (
                    <ul className="space-y-2.5">
                      {recentGoals.map((goal) => (
                        <li
                          key={goal.id}
                          className="rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors duration-200 hover:border-line-strong"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-medium text-ink">{goal.title}</p>
                            <Chip meta={GOAL_STATUS[goal.status]} />
                          </div>
                          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-3">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {goal.targetDate
                              ? `Target: ${formatDate(goal.targetDate)}`
                              : 'No target date'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
