import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { getPayment } from '../../services/paymentService'
import useApiData from '../../hooks/useApiData'

const PLAN_LABELS = { PRO: 'Pro', CONSTELLATION: 'Constellation' }

export default function CheckoutStatus({ icon: Icon, tone, title, text }) {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('external_reference')

  const fetchData = useCallback(
    () => (paymentId ? getPayment(paymentId) : Promise.resolve(null)),
    [paymentId],
  )
  const { data: payment, status } = useApiData(fetchData)

  return (
    <div className="animate-fade-in flex min-h-[60svh] flex-col items-center justify-center text-center motion-reduce:animate-none">
      <span className={`flex h-14 w-14 items-center justify-center rounded-full ${tone}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">{text}</p>

      {status === 'ready' && payment ? (
        <Badge className="mt-6">
          {PLAN_LABELS[payment.plan] ?? payment.plan} · {payment.status}
        </Badge>
      ) : null}

      <Button href="/dashboard" variant="outline" size="md" className="mt-8">
        Back to dashboard
      </Button>
    </div>
  )
}
