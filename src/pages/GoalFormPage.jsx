import { useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CircleAlert, RotateCw } from 'lucide-react'
import GoalForm from '../components/goals/GoalForm'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'
import useApiData from '../hooks/useApiData'
import { createGoal, getGoal, updateGoal } from '../services/goalService'

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

export default function GoalFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const fetchData = useCallback(() => (isEdit ? getGoal(id) : Promise.resolve(null)), [id, isEdit])
  const { data: goal, status, error: loadError, retry } = useApiData(fetchData)

  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleSubmit = async (request) => {
    if (isEdit) {
      await updateGoal(id, request)
    } else {
      await createGoal(request)
    }
  }

  const handleSuccess = () => {
    timerRef.current = setTimeout(() => navigate('/goals', { replace: true }), 1200)
  }

  const notFound = loadError?.status === 404

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          to="/goals"
          className="inline-flex items-center gap-1.5 rounded-md py-1.5 text-sm font-medium text-ink-2 transition-colors hover:text-ink focus-visible:focus-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to goals
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {isEdit ? 'Edit goal' : 'New goal'}
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          {isEdit ? 'Update the details of your goal.' : 'Set a goal to give your work a direction.'}
        </p>
      </div>

      {status === 'loading' ? <FormSkeleton /> : null}

      {status === 'error' ? (
        <div role="alert">
          <EmptyState
            tone="error"
            icon={CircleAlert}
            title={notFound ? 'Goal not found' : 'Something went wrong'}
            text={
              notFound
                ? 'This goal may have been deleted or the link is incorrect.'
                : loadError?.message
            }
            className="border-solid border-error/30 bg-error/5"
          >
            {notFound ? (
              <Button href="/goals" variant="outline" size="sm">
                Back to goals
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
        <GoalForm
          key={goal?.id ?? 'new'}
          initial={goal}
          submitLabel={isEdit ? 'Save changes' : 'Create goal'}
          successMessage={
            isEdit
              ? 'Goal updated — heading back to your goals…'
              : 'Goal created — heading to your goals…'
          }
          onSubmit={handleSubmit}
          onCancel={() => navigate('/goals')}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  )
}
