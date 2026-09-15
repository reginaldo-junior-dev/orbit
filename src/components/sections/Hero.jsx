import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Container from '../ui/Container'
import DashboardPreview from '../shared/DashboardPreview'
import OrbitalBackground from '../shared/OrbitalBackground'

function FloatingCard({ className, icon: Icon, title, description }) {
  return (
    <div
      className={`animate-float absolute hidden items-center gap-3 rounded-xl border border-line bg-surface/90 p-3.5 shadow-xl backdrop-blur-sm motion-reduce:animate-none md:flex ${className}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold text-ink">{title}</p>
        <p className="text-[11px] text-ink-3">{description}</p>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <OrbitalBackground />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="animate-fade-in motion-reduce:animate-none">
            <Badge>
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              A personal productivity concept
            </Badge>
          </div>

          <h1
            className="animate-fade-in mt-6 font-display text-5xl leading-[1.06] font-semibold tracking-tight text-ink motion-reduce:animate-none sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '0.1s' }}
          >
            Bring order to your
            <span className="block bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              personal universe.
            </span>
          </h1>

          <p
            className="animate-fade-in mt-6 max-w-xl text-base leading-relaxed text-ink-2 motion-reduce:animate-none sm:text-lg"
            style={{ animationDelay: '0.2s' }}
          >
            Orbit brings your tasks, habits and focus into one calm place — so every
            day follows a clear path instead of a pile of open tabs.
          </p>

          <div
            className="animate-fade-in mt-9 flex w-full flex-col items-center justify-center gap-3 motion-reduce:animate-none sm:w-auto sm:flex-row"
            style={{ animationDelay: '0.3s' }}
          >
            <Button href="#pricing" size="lg" className="w-full sm:w-auto">
              Start for free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button href="#how-it-works" variant="ghost" size="lg" className="w-full sm:w-auto">
              See how it works
            </Button>
          </div>

          <div
            className="animate-fade-in mt-8 flex items-center gap-3 motion-reduce:animate-none"
            style={{ animationDelay: '0.4s' }}
          >
            <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
            <p className="text-sm text-ink-3">
              A product concept built for focused, intentional work
            </p>
          </div>
        </div>

        <div
          className="animate-fade-in relative mx-auto mt-16 max-w-5xl motion-reduce:animate-none sm:mt-20"
          style={{ animationDelay: '0.5s' }}
        >
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] opacity-60 blur-2xl"
            style={{
              background:
                'radial-gradient(50% 60% at 50% 40%, color-mix(in oklab, var(--color-accent) 25%, transparent), transparent)',
            }}
          />
          <DashboardPreview />
          <FloatingCard
            className="top-[-1.5rem] left-[-2.5rem] animate-float-delayed lg:left-[-4rem]"
            icon={Zap}
            title="+38% focus this week"
            description="Deep work is compounding"
          />
          <FloatingCard
            className="right-[-2.5rem] bottom-[-1.5rem] lg:right-[-4rem]"
            icon={Star}
            title="Habit streak: 21 days"
            description="Keep the streak alive"
          />
        </div>
      </Container>
    </section>
  )
}
