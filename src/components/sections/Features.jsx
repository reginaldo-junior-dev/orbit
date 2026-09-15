import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CloudSync,
  Flame,
  ListTodo,
  Monitor,
  Play,
  Smartphone,
  Timer,
  TrendingUp,
} from 'lucide-react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../shared/Reveal'

function TasksVisual() {
  return (
    <div className="flex flex-wrap gap-2">
      {['Inbox', 'Today', 'This week', 'Someday'].map((chip, i) => (
        <span
          key={chip}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            i === 1
              ? 'border-accent/50 bg-accent/10 text-accent'
              : 'border-line bg-surface-2 text-ink-3'
          }`}
        >
          {chip}
        </span>
      ))}
    </div>
  )
}

function CalendarVisual() {
  return (
    <div className="grid grid-cols-7 gap-1">
      {[
        'dim', 'dim', 'dim', 'block', 'dim', 'block', 'dim',
        'dim', 'today', 'block', 'dim', 'dim', 'dim', 'dim',
      ].map((cell, i) => (
        <span
          key={i}
          className={`flex h-6 items-center justify-center rounded-md border ${
            cell === 'block'
              ? 'border-accent/40 bg-accent/20'
              : cell === 'today'
                ? 'relative border-line-strong bg-surface-2'
                : 'border-line bg-surface-2/50'
          }`}
        >
          {cell === 'today' ? (
            <span className="absolute h-1 w-1 rounded-full bg-accent" />
          ) : null}
        </span>
      ))}
    </div>
  )
}

function StreakVisual() {
  const done = [true, true, true, true, true, true, false]
  return (
    <div className="flex items-center gap-1.5">
      {done.map((isDone, i) => (
        <span
          key={i}
          className={`flex h-6 w-6 items-center justify-center rounded-full border ${
            isDone
              ? 'border-accent/50 bg-accent/15'
              : 'border-dashed border-line-strong bg-surface-2'
          }`}
        >
          {isDone ? (
            <Check className="h-3 w-3 text-accent" aria-hidden="true" />
          ) : (
            <Flame className="h-3 w-3 text-amber" aria-hidden="true" />
          )}
        </span>
      ))}
    </div>
  )
}

function FocusVisual() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
        <Play className="h-3.5 w-3.5 fill-bg text-bg" aria-hidden="true" />
      </span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-line">
        <span className="block h-full w-[68%] rounded-full bg-gradient-to-r from-accent to-accent-hover" />
      </span>
      <span className="font-mono text-xs font-medium text-ink-3">1h 52m</span>
    </div>
  )
}

function InsightsVisual() {
  const bars = [35, 50, 40, 65, 55, 80, 62]
  return (
    <div className="flex items-end gap-2">
      <div className="flex h-14 flex-1 items-end gap-1.5">
        {bars.map((height, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${
              i === bars.length - 1 ? 'bg-accent' : 'bg-accent/25'
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold text-accent">
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        +18%
      </span>
    </div>
  )
}

function SyncVisual() {
  return (
    <div className="flex items-center">
      <span className="flex h-12 w-14 items-center justify-center rounded-lg border border-line bg-surface-2">
        <Monitor className="h-5 w-5 text-ink-2" aria-hidden="true" />
      </span>
      <span className="relative mx-3 h-px flex-1 border-t border-dashed border-line-strong">
        <span className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </span>
      <span className="flex h-12 w-9 items-center justify-center rounded-lg border border-line bg-surface-2">
        <Smartphone className="h-5 w-5 text-ink-2" aria-hidden="true" />
      </span>
    </div>
  )
}

const VISUALS = {
  tasks: TasksVisual,
  calendar: CalendarVisual,
  streak: StreakVisual,
  focus: FocusVisual,
  insights: InsightsVisual,
  sync: SyncVisual,
}

const FEATURES = [
  {
    icon: ListTodo,
    title: 'Tasks that plan themselves',
    description:
      'Capture anything in seconds. Orbit sorts it into your day by priority, energy and deadline — no reshuffling required.',
    visual: 'tasks',
    wide: true,
  },
  {
    icon: CalendarDays,
    title: 'Your calendar, in orbit',
    description:
      'See tasks and events on one timeline. Time-block your week in a couple of clicks.',
    visual: 'calendar',
  },
  {
    icon: Flame,
    title: 'Habit streaks',
    description:
      'Build routines that stick with gentle daily check-ins and streaks you actually care about.',
    visual: 'streak',
  },
  {
    icon: Timer,
    title: 'Focus mode',
    description:
      'One button silences everything else and starts a deep-work timer with calm ambient sound.',
    visual: 'focus',
  },
  {
    icon: TrendingUp,
    title: 'Weekly insights',
    description:
      'Learn where your time really goes and get one honest suggestion to improve your week.',
    visual: 'insights',
  },
  {
    icon: CloudSync,
    title: 'Synced everywhere',
    description:
      'Web, desktop and mobile stay in sync. Start on one device, finish on another.',
    visual: 'sync',
  },
]

function FeatureCard({ feature, index }) {
  const Icon = feature.icon
  const Visual = VISUALS[feature.visual]
  return (
    <Reveal
      delay={index * 80}
      className={feature.wide ? 'lg:col-span-2' : ''}
      as="article"
    >
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/15">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-ink">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{feature.description}</p>

        <div className="mt-6 flex-1" />
        <div className="border-t border-line pt-5" aria-hidden="true">
          <Visual />
        </div>
      </div>
    </Reveal>
  )
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-24 sm:py-32" aria-labelledby="features-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="features-title"
            eyebrow="Features"
            title="Everything you need to keep your day in orbit"
            description="Orbit replaces the pile of tools with one focused workspace — designed to be calm, fast and effortless."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}
