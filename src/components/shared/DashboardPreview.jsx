import {
  CalendarDays,
  ChevronDown,
  CircleCheckBig,
  Flame,
  Search,
  Settings,
  Sun,
  Target,
  TrendingUp,
} from 'lucide-react'

const NAV_ITEMS = [
  { icon: Target, label: 'Today', active: true },
  { icon: CalendarDays, label: 'Calendar' },
  { icon: Flame, label: 'Habits' },
  { icon: TrendingUp, label: 'Insights' },
]

const TASKS = [
  { title: 'Write Orbit launch notes', tag: 'Deep work', tagColor: 'var(--color-accent)', done: true },
  { title: 'Review weekly goals', tag: 'Planning', tagColor: 'var(--color-info)', done: true },
  { title: 'Ship landing page copy', tag: 'Ship', tagColor: 'var(--color-success)', done: false },
  { title: 'Read: The 4-Hour Workweek', tag: 'Reading', tagColor: 'var(--color-amber)', done: false },
]

const BARS = [38, 55, 42, 70, 58, 86, 64]

function Sidebar() {
  return (
    <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-line p-4 sm:flex">
      <div className="mb-4 flex items-center gap-2 px-2">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="h-5 w-5">
          <circle
            cx="16"
            cy="16"
            r="9.5"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform="rotate(-24 16 16)"
          />
          <circle cx="16" cy="16" r="3.75" fill="var(--color-accent)" />
        </svg>
        <span className="font-display text-sm font-semibold text-ink">Orbit</span>
      </div>
      {NAV_ITEMS.map((item) => (
        <span
          key={item.label}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium ${
            item.active ? 'bg-accent/10 text-accent' : 'text-ink-3'
          }`}
        >
          <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
          {item.label}
        </span>
      ))}
      <div className="mt-auto space-y-1">
        <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-ink-3">
          <Settings className="h-3.5 w-3.5" aria-hidden="true" />
          Settings
        </span>
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-active text-[10px] font-semibold text-bg">
            A
          </span>
          <span className="text-xs font-medium text-ink-2">Ava Chen</span>
        </div>
      </div>
    </aside>
  )
}

function TaskList() {
  return (
    <div className="flex-1 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-ink-3 uppercase">
            Tuesday, Sept 9
          </p>
          <h3 className="font-display text-lg font-semibold text-ink">Good morning, Ava</h3>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface-2 text-ink-3">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-ink-2 uppercase">
        Today&apos;s orbit
      </p>
      <ul className="space-y-2">
        {TASKS.map((task) => (
          <li
            key={task.title}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface-2/60 px-3 py-2.5"
          >
            {task.done ? (
              <CircleCheckBig className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <span
                className="h-4 w-4 shrink-0 rounded-full border-2"
                style={{ borderColor: 'var(--color-line-strong)' }}
              />
            )}
            <span
              className={`flex-1 truncate text-xs font-medium ${
                task.done ? 'text-ink-3 line-through' : 'text-ink'
              }`}
            >
              {task.title}
            </span>
            <span
              className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold md:inline"
              style={{
                color: task.tagColor,
                backgroundColor: `color-mix(in oklab, ${task.tagColor} 12%, transparent)`,
              }}
            >
              {task.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FocusPanel() {
  return (
    <div className="hidden w-52 shrink-0 flex-col gap-4 border-l border-line p-5 lg:flex">
      <div className="text-center">
        <p className="mb-3 text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          Focus
        </p>
        <div className="relative mx-auto h-24 w-24">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 24px color-mix(in oklab, var(--color-accent) 25%, transparent)',
            }}
          />
          <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="7"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="251.3"
              strokeDashoffset="80.4"
            />
          </svg>
          <span
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_rgba(139,124,255,0.9)]"
            style={{ left: '12.3%', top: '67.7%' }}
          />
          <span
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"
            style={{ left: '64.2%', top: '89.2%' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-xl font-semibold text-ink">68%</span>
            <span className="text-[10px] text-ink-3">today</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-ink-3">1h 52m in deep work</p>
      </div>
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-ink-3 uppercase">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          This week
        </p>
        <div className="flex h-20 items-end gap-1.5">
          {BARS.map((height, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm"
              style={{
                height: `${height}%`,
                backgroundColor:
                  index === BARS.length - 1
                    ? 'var(--color-accent)'
                    : 'color-mix(in oklab, var(--color-accent) 30%, var(--color-surface-2))',
              }}
            />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-surface-2/60 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber">
          <Flame className="h-3 w-3" aria-hidden="true" />
          21-day streak
        </p>
        <p className="mt-1 text-[11px] leading-snug text-ink-3">
          One more day to a new record.
        </p>
      </div>
    </div>
  )
}

export default function DashboardPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the Orbit dashboard showing today's tasks, a focus ring and weekly insights"
      className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_80px_-24px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
        <span className="ml-3 flex items-center gap-1.5 rounded-md border border-line bg-bg px-2.5 py-1 text-[10px] text-ink-3">
          <Sun className="h-2.5 w-2.5" aria-hidden="true" />
          orbit.app/today
          <ChevronDown className="h-2.5 w-2.5" aria-hidden="true" />
        </span>
        <span className="ml-auto rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-ink-3 uppercase">
          Demo UI
        </span>
      </div>
      <div className="flex">
        <Sidebar />
        <TaskList />
        <FocusPanel />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
        }}
      />
    </div>
  )
}
