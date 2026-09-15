import { Inbox, Orbit, Timer, TrendingUp } from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../shared/Reveal'

const WORKFLOWS = [
  { name: 'Capture', icon: Inbox },
  { name: 'Plan', icon: Orbit },
  { name: 'Focus', icon: Timer },
  { name: 'Reflect', icon: TrendingUp },
]

export default function SocialProof() {
  return (
    <section
      aria-label="Designed for modern workflows"
      className="border-y border-line bg-surface/60"
    >
      <Container className="py-12 sm:py-14">
        <Reveal>
          <p className="text-center text-sm font-medium tracking-wide text-ink-3">
            Designed for modern workflows
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
            {WORKFLOWS.map((workflow) => (
              <li
                key={workflow.name}
                className="flex items-center gap-2 text-ink-3 transition-colors hover:text-ink-2"
              >
                <workflow.icon className="h-4 w-4" aria-hidden="true" />
                <span className="font-display text-base font-semibold tracking-tight">
                  {workflow.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
