import { Compass, Moon, Sparkles, Sunset, Target, Timer } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../shared/Reveal'

const PRINCIPLES = [
  {
    icon: Sparkles,
    number: '01',
    title: 'Simplicity',
    description: 'One calm workspace instead of a pile of tools.',
  },
  {
    icon: Compass,
    number: '02',
    title: 'Clarity',
    description: 'A clear plan for every day, from the start.',
  },
  {
    icon: Moon,
    number: '03',
    title: 'Calm',
    description: 'Gentle nudges instead of guilt-based pressure.',
  },
  {
    icon: Timer,
    number: '04',
    title: 'Focus',
    description: 'Deep work with real boundaries.',
  },
  {
    icon: Target,
    number: '05',
    title: 'Intentionality',
    description: 'Small improvements that compound over time.',
  },
  {
    icon: Sunset,
    number: '06',
    title: 'Reflection',
    description: 'End each day knowing where your time went.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32" aria-labelledby="testimonials-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="testimonials-title"
            eyebrow="Design principles"
            title="Built around a simple idea"
            description="Plan, focus and reflect in one calm workspace."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((principle, index) => {
            const Icon = principle.icon
            return (
              <Reveal key={principle.number} delay={(index % 3) * 100} as="article">
                <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-line-strong sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <span
                      className="font-display text-sm font-semibold tracking-[0.2em] text-ink-3"
                      aria-hidden="true"
                    >
                      {principle.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
