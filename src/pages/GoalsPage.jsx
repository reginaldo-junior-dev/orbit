import { useCallback, useMemo, useState } from 'react'
import { CircleAlert, Plus, RotateCw, Target } from 'lucide-react'
import GoalCard from '../components/goals/GoalCard'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import FilterPills from '../components/ui/FilterPills'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { cx } from '../lib/cx'
import { daysBetween, todayIso } from '../lib/date'
import { listGoals } from '../services/goalService'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
]

function GoalsSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading goals…</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const fetchData = useCallback(() => listGoals(), [])
  const { data, status, error: loadError, retry } = useApiData(fetchData)
  const goals = useMemo(() => data ?? [], [data])
  const [statusFilter, setStatusFilter] = useState('ALL')

  const today = todayIso()

  const summary = useMemo(() => {
    const activeGoals = goals.filter((goal) => goal.status === 'ACTIVE')
    const dueSoon = activeGoals.filter((goal) => {
      if (!goal.targetDate) return false
      const days = daysBetween(today, goal.targetDate)
      return days >= 0 && days <= 7
    })
    return {
      active: activeGoals.length,
      completed: goals.filter((goal) => goal.status === 'COMPLETED').length,
      dueSoon: dueSoon.length,
    }
  }, [goals, today])

  const visibleGoals = useMemo(() => {
    const list = goals.filter(
      (goal) => statusFilter === 'ALL' || goal.status === statusFilter,
    )
    return list.sort((a, b) => {
      if ((a.status === 'ACTIVE') !== (b.status === 'ACTIVE')) {
        return a.status === 'ACTIVE' ? -1 : 1
      }
      return (
        (a.targetDate ?? '9999').localeCompare(b.targetDate ?? '9999') ||
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    })
  }, [goals, statusFilter])

  const summaryCards = [
    { key: 'active', label: 'Active goals', value: summary.active, dot: 'bg-accent' },
    { key: 'completed', label: 'Completed', value: summary.completed, dot: 'bg-success' },
    { key: 'due-soon', label: 'Due in 7 days', value: summary.dueSoon, dot: 'bg-amber' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Goals
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            Give your work a direction and watch the distance shrink.
          </p>
        </div>
        <Button href="/goals/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New goal
        </Button>
      </div>

      {status === 'loading' ? <GoalsSkeleton /> : null}

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
          <div className="grid gap-4 sm:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.key}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5"
              >
                <span className={cx('h-2 w-2 shrink-0 rounded-full', card.dot)} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {card.value}
                  </p>
                  <p className="truncate text-xs text-ink-3">{card.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterPills
              options={STATUS_FILTERS}
              value={statusFilter}
              onChange={setStatusFilter}
              label="Filter by status"
            />
            {goals.length > 0 ? (
              <p className="ml-auto text-xs text-ink-3">
                Showing {visibleGoals.length} of {goals.length} goals
              </p>
            ) : null}
          </div>

          {goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals yet"
              text="Set a goal to give your work a clear direction."
            >
              <Button href="/goals/new">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Create goal
              </Button>
            </EmptyState>
          ) : visibleGoals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals match your filters"
              text="Try a different status filter to see more of your goals."
            >
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('ALL')}>
                Clear filters
              </Button>
            </EmptyState>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
