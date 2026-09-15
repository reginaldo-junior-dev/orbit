import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import Chip from '../ui/Chip'
import ProgressBar from '../ui/ProgressBar'
import { formatDate } from '../../lib/date'
import { PROJECT_STATUS } from '../../lib/status'

export default function ProjectCard({ project, taskCount, doneCount }) {
  const percent = taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : null

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40 focus-visible:focus-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
            {project.name}
          </p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-3">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Created {project.createdAt ? formatDate(project.createdAt.slice(0, 10)) : '—'}
          </p>
        </div>
        <Chip meta={PROJECT_STATUS[project.status]} />
      </div>

      {project.description ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-2">
          {project.description}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        {percent !== null ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-xs text-ink-3">
              <span>
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </span>
              <span>{percent}% done</span>
            </div>
            <ProgressBar value={percent} className="mt-2" label={`${project.name} is ${percent}% complete`} />
          </div>
        ) : (
          <p className="text-xs text-ink-3">No tasks yet</p>
        )}
      </div>
    </Link>
  )
}
