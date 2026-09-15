import { Clock } from 'lucide-react'
import CheckoutStatus from '../components/shared/CheckoutStatus'

export default function CheckoutPendingPage() {
  return (
    <CheckoutStatus
      icon={Clock}
      tone="bg-amber/10 text-amber"
      title="Payment pending"
      text="Your payment is still being processed. We'll update your plan automatically as soon as Mercado Pago confirms it."
    />
  )
}
