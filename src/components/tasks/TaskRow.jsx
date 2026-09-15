import { Link } from 'react-router-dom'
import { CalendarDays, FolderKanban, Pencil, Trash2 } from 'lucide-react'
import Chip from '../ui/Chip'
import Select from '../ui/Select'
import { cx } from '../../lib/cx'
import { dueDateLabel, isOverdue } from '../../lib/date'
import { PRIORITY } from '../../lib/status'

export default function TaskRow({ task, projectName, busy, onStatusChange, onDelete }) {
  const due = dueDateLabel(task.dueDate)
  const overdue = isOverdue(task.dueDate)

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-line-strong sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5">
          <span
            className={cx(
              'h-2 w-2 shrink-0 rounded-full',
              task.status === 'DONE'
                ? 'bg-success'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-accent'
                  : 'bg-ink-3',
            )}
            title={
              task.status === 'DONE'
                ? 'Done'
                : task.status === 'IN_PROGRESS'
                  ? 'In progress'
                  : 'To do'
            }
            aria-hidden="true"
          />
          <Link
            to={`/tasks/${task.id}`}
            className={cx(
              'truncate rounded-sm text-sm font-medium transition-colors duration-200 focus-visible:focus-ring',
              task.status === 'DONE' ? 'text-ink-3 line-through' : 'text-ink hover:text-accent',
            )}
          >
            {task.title}
          </Link>
        </div>
        {task.description ? (
          <p className="mt-1 line-clamp-1 pl-[18px] text-xs text-ink-3">{task.description}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2 pl-[18px]">
          <Chip meta={PRIORITY[task.priority]} />
          {projectName ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-2">
              <FolderKanban className="h-3 w-3 shrink-0 text-ink-3" aria-hidden="true" />
              <span className="max-w-40 truncate">{projectName}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
        <Select
          value={task.status}
          disabled={busy}
          onChange={(event) => onStatusChange(task, event.target.value)}
          className="h-9 min-w-34 text-xs"
          aria-label={`Change status of ${task.title}`}
        >
          <option value="TODO">To do</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DONE">Done</option>
        </Select>

        {due ? (
          <span
            className={cx(
              'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium',
              overdue ? 'text-error' : 'text-ink-2',
            )}
          >
            <CalendarDays className="h-3 w-3 shrink-0" aria-hidden="true" />
            {due}
          </span>
        ) : null}

        <div className="flex items-center gap-1">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-ink focus-visible:focus-ring"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-error focus-visible:focus-ring"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  )
}
