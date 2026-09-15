import { CircleAlert } from 'lucide-react'
import CheckoutStatus from '../components/shared/CheckoutStatus'

export default function CheckoutFailurePage() {
  return (
    <CheckoutStatus
      icon={CircleAlert}
      tone="bg-error/10 text-error"
      title="Payment not completed"
      text="Your payment was not approved or was cancelled. No charge was made — you can try again whenever you're ready."
    />
  )
}
