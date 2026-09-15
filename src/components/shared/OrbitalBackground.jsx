const STARS = [
  { top: '8%', left: '12%', size: 2, opacity: 0.7, delay: '0s' },
  { top: '14%', left: '28%', size: 1, opacity: 0.5, delay: '1.4s' },
  { top: '6%', left: '55%', size: 1, opacity: 0.6, delay: '0.8s' },
  { top: '18%', left: '72%', size: 2, opacity: 0.8, delay: '2.2s' },
  { top: '10%', left: '88%', size: 1, opacity: 0.55, delay: '1.8s' },
  { top: '30%', left: '6%', size: 1, opacity: 0.45, delay: '2.6s' },
  { top: '38%', left: '92%', size: 2, opacity: 0.6, delay: '0.4s' },
  { top: '26%', left: '42%', size: 1, opacity: 0.4, delay: '3.1s' },
  { top: '48%', left: '16%', size: 1, opacity: 0.5, delay: '1.1s' },
  { top: '60%', left: '80%', size: 1, opacity: 0.45, delay: '2.9s' },
  { top: '4%', left: '40%', size: 1, opacity: 0.35, delay: '3.6s' },
  { top: '22%', left: '64%', size: 1, opacity: 0.4, delay: '0.2s' },
]

function OrbitRing({ size, className, dotClassName, planetColor }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-orbit absolute left-1/2 top-1/2 motion-reduce:animate-none ${className}`}
    >
      <div
        className="relative rounded-full border"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: 'translate(-50%, -50%)',
          borderColor: 'var(--color-line)',
        }}
      >
        <span
          className={`absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${dotClassName}`}
          style={{ backgroundColor: planetColor }}
        />
      </div>
    </div>
  )
}

export default function OrbitalBackground({ className }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
    >
      <div
        className="animate-glow-pulse absolute left-1/2 top-[-20%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl motion-reduce:animate-none"
        style={{ background: 'color-mix(in oklab, var(--color-accent) 14%, transparent)' }}
      />
      <OrbitRing
        size={760}
        className="animate-orbit-slow"
        planetColor="var(--color-accent)"
        dotClassName="h-2.5 w-2.5 shadow-[0_0_12px_rgba(139,124,255,0.8)]"
      />
      <OrbitRing
        size={560}
        className="animate-orbit-reverse"
        planetColor="var(--color-amber)"
        dotClassName="h-1.5 w-1.5"
      />
      <OrbitRing
        size={380}
        className="animate-orbit-slow"
        planetColor="var(--color-ink-3)"
        dotClassName="h-1 w-1"
      />
      {STARS.map((star) => (
        <span
          key={`${star.top}-${star.left}`}
          className="animate-glow-pulse absolute rounded-full bg-ink-3 motion-reduce:animate-none"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
