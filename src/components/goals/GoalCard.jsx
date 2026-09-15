import { Link } from 'react-router-dom'
import { CalendarDays, Pencil, Target } from 'lucide-react'
import Chip from '../ui/Chip'
import ProgressBar from '../ui/ProgressBar'
import { cx } from '../../lib/cx'
import { daysBetween, formatDate, todayIso } from '../../lib/date'
import { GOAL_STATUS } from '../../lib/status'

function daysLeftLabel(goal, today) {
  if (!goal.targetDate) return null
  const days = daysBetween(today, goal.targetDate)
  if (days < 0) return `Overdue by ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`
  if (days === 0) return 'Due today'
  return `${days} ${days === 1 ? 'day' : 'days'} left`
}

export default function GoalCard({ goal }) {
  const today = todayIso()
  const active = goal.status === 'ACTIVE'

  let timelinePercent = null
  if (active && goal.targetDate && goal.createdAt) {
    const start = goal.createdAt.slice(0, 10)
    const total = daysBetween(start, goal.targetDate)
    if (total > 0) {
      timelinePercent = Math.min(
        100,
        Math.max(0, Math.round((daysBetween(start, today) / total) * 100)),
      )
    }
  }

  const targetText = daysLeftLabel(goal, today)
  const overdue = goal.targetDate && daysBetween(today, goal.targetDate) < 0

  return (
    <div className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors duration-200 hover:border-accent/40">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <Target className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
        </span>
        <div className="flex items-center gap-2">
          <Chip meta={GOAL_STATUS[goal.status]} />
          <Link
            to={`/goals/${goal.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-3 transition-colors duration-200 hover:bg-surface-2 hover:text-ink focus-visible:focus-ring"
            aria-label={`Edit ${goal.title}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Link
        to={`/goals/${goal.id}`}
        className="mt-4 rounded-sm focus-visible:focus-ring"
      >
        <p className="font-display text-base font-semibold tracking-tight text-ink transition-colors duration-200 group-hover:text-accent">
          {goal.title}
        </p>
      </Link>

      {goal.description ? (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">
          {goal.description}
        </p>
      ) : null}

      <div className="mt-auto pt-5">
        {timelinePercent !== null ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-xs text-ink-3">
              <span className={cx(overdue && 'font-medium text-error')}>
                {targetText}
              </span>
              <span>{timelinePercent}% of timeline</span>
            </div>
            <ProgressBar
              value={timelinePercent}
              className="mt-2"
              label={`${goal.title} is ${timelinePercent}% through its timeline`}
            />
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-ink-3">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {goal.targetDate
              ? `Target ${formatDate(goal.targetDate)}${targetText ? ` · ${targetText}` : ''}`
              : 'No target date'}
          </p>
        )}
      </div>
    </div>
  )
}
