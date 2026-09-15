import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, LoaderCircle } from 'lucide-react'
import { cx } from '../../lib/cx'
import Button from '../ui/Button'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../shared/Reveal'
import { useAuth } from '../../context/auth'
import { createPreference } from '../../services/paymentService'

const PLANS = [
  {
    name: 'Starter',
    description: 'For getting your days back under control.',
    monthly: 0,
    annual: 0,
    cta: 'Start for free',
    variant: 'outline',
    features: [
      'Unlimited tasks and lists',
      'Daily planning',
      'Habits (up to 3)',
      'Calendar view',
      'Sync across 2 devices',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    planCode: 'PRO',
    description: 'For people serious about focus and streaks.',
    monthly: 8,
    annual: 6,
    cta: 'Start 14-day free trial',
    variant: 'primary',
    features: [
      'Everything in Starter',
      'Unlimited habits',
      'Focus mode + ambient sounds',
      'Weekly insights',
      'Unlimited devices',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Constellation',
    planCode: 'CONSTELLATION',
    description: 'For teams that plan and reflect together.',
    monthly: 24,
    annual: 19,
    cta: 'Start team trial',
    variant: 'outline',
    features: [
      'Everything in Pro',
      'Shared workspaces',
      'Team planning',
      'Admin controls',
      'SSO & advanced security',
    ],
    featured: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)
  const [checkout, setCheckout] = useState({ planCode: null, loading: false, error: null })
  const { status: authStatus } = useAuth()
  const navigate = useNavigate()

  const handlePlanClick = async (planCode) => {
    const billingCycle = annual ? 'ANNUAL' : 'MONTHLY'

    if (authStatus !== 'authenticated') {
      navigate(`/register?plan=${planCode}&cycle=${billingCycle}`)
      return
    }

    setCheckout({ planCode, loading: true, error: null })
    try {
      const { checkoutUrl } = await createPreference(planCode, billingCycle)
      window.location.assign(checkoutUrl)
    } catch {
      setCheckout({
        planCode,
        loading: false,
        error: 'Could not start checkout. Please try again.',
      })
    }
  }

  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-line bg-surface/60 py-24 sm:py-32"
      aria-labelledby="pricing-title"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="pricing-title"
            eyebrow="Pricing"
            title="Simple pricing, no surprises"
            description="Start free. Upgrade when your orbit grows. Cancel anytime."
          />
          <p className="mt-5 text-center text-sm text-ink-3">
            Example pricing for the Orbit product concept.
          </p>
        </Reveal>

        <Reveal className="mt-10 flex justify-center">
          <div
            className="relative inline-grid grid-cols-2 items-center rounded-full border border-line bg-surface p-1"
            role="group"
            aria-label="Billing period"
          >
            <span
              aria-hidden="true"
              className={cx(
                'absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-accent/15 transition-transform duration-300 ease-out motion-reduce:transition-none',
                annual ? 'translate-x-full' : 'translate-x-0',
              )}
            />
            <button
              type="button"
              aria-pressed={!annual}
              onClick={() => setAnnual(false)}
              className={cx(
                'relative z-10 flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300',
                !annual ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={annual}
              onClick={() => setAnnual(true)}
              className={cx(
                'relative z-10 flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300',
                annual ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
              )}
            >
              Annual
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                −25%
              </span>
            </button>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 100} as="article">
              <div
                className={cx(
                  'relative flex h-full flex-col rounded-2xl border bg-surface p-7 transition-colors duration-300',
                  plan.featured
                    ? 'border-accent/60 shadow-[0_0_48px_rgba(139,124,255,0.18)]'
                    : 'border-line hover:border-line-strong',
                )}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3.5 py-1 text-[11px] font-semibold tracking-wide text-bg">
                    Most popular
                  </span>
                ) : null}

                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {plan.name}
                </h3>
                <p className="mt-1.5 text-sm text-ink-3">{plan.description}</p>

                <p className="mt-6 flex items-baseline gap-1.5">
                  <span
                    key={annual ? 'annual' : 'monthly'}
                    className="animate-fade-in font-display text-5xl font-semibold tracking-tight text-ink motion-reduce:animate-none"
                  >
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-sm text-ink-3">/ month</span>
                </p>
                <p className="mt-1 h-4 text-xs text-ink-3">
                  {plan.monthly === 0
                    ? 'Free forever'
                    : annual
                      ? 'Billed annually'
                      : 'Billed monthly'}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5 border-t border-line pt-7">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-ink-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.planCode ? (
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="mt-8 w-full"
                    disabled={checkout.loading && checkout.planCode === plan.planCode}
                    onClick={() => handlePlanClick(plan.planCode)}
                  >
                    {checkout.loading && checkout.planCode === plan.planCode ? (
                      <>
                        <LoaderCircle
                          className="h-4 w-4 animate-spin motion-reduce:animate-none"
                          aria-hidden="true"
                        />
                        Redirecting…
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                ) : (
                  <Button href="/register" variant={plan.variant} size="lg" className="mt-8 w-full">
                    {plan.cta}
                  </Button>
                )}

                {checkout.error && checkout.planCode === plan.planCode ? (
                  <p className="mt-3 text-center text-xs text-error" role="alert">
                    {checkout.error}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-center text-sm text-ink-3">
            All plans include end-to-end encryption, offline mode and export. No credit
            card required to start.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
