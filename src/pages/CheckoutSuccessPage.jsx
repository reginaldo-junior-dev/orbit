import { CircleCheck } from 'lucide-react'
import CheckoutStatus from '../components/shared/CheckoutStatus'

export default function CheckoutSuccessPage() {
  return (
    <CheckoutStatus
      icon={CircleCheck}
      tone="bg-success/10 text-success"
      title="Payment approved"
      text="Your plan is being activated. This can take a few seconds while we confirm the payment with Mercado Pago."
    />
  )
}
