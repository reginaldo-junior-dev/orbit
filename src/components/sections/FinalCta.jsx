import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import Container from '../ui/Container'
import OrbitalBackground from '../shared/OrbitalBackground'
import Reveal from '../shared/Reveal'

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="pb-24 sm:pb-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-16 text-center sm:px-12 sm:py-24">
            <OrbitalBackground />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
              }}
            />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <h2
                id="final-cta-title"
                className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              >
                Your universe, in order.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-2 sm:text-lg">
                Start every day with a clear orbit. A concept built to be calm by
                design.
              </p>
              <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                <Button href="#pricing" size="lg" className="w-full sm:w-auto">
                  Start for free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <p className="mt-5 text-sm text-ink-3">
                Example pricing · No credit card required
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
