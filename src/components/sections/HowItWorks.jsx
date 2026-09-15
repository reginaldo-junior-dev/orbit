import { Inbox, Orbit, Timer } from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../shared/Reveal'

const STEPS = [
  {
    icon: Inbox,
    number: '01',
    title: 'Capture everything',
    description:
      'Drop tasks, notes and ideas into Orbit the moment they show up. Your mind stays clear; Orbit holds the rest.',
  },
  {
    icon: Orbit,
    number: '02',
    title: 'Plan your orbit',
    description:
      'Each morning, Orbit suggests a realistic path for the day. Approve it or drag things around — planning takes 60 seconds.',
  },
  {
    icon: Timer,
    number: '03',
    title: 'Stay on course',
    description:
      'Work through the day with focus sessions, streaks and gentle nudges. Every evening, get a quiet summary of the day.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-line bg-surface/60 py-24 sm:py-32"
      aria-labelledby="how-it-works-title"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="how-it-works-title"
            eyebrow="How it works"
            title="Three steps to a calmer day"
            description="No setup marathons, no 40-page guides. Orbit gets out of the way and lets you work."
          />
        </Reveal>

        <ol className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          <div
            aria-hidden="true"
            className="absolute top-7 right-[16%] left-[16%] hidden border-t border-dashed border-line-strong md:block"
          />
          {STEPS.map((step, index) => {
            const Icon = step.icon
            return (
              <li key={step.number} className="relative">
                <Reveal delay={index * 120}>
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-accent">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p
                    className="mt-6 font-display text-sm font-semibold tracking-[0.2em] text-accent"
                    aria-hidden="true"
                  >
                    {step.number}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-2">{step.description}</p>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </Container>
    </section>
  )
}
