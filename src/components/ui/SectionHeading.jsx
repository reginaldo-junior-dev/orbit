import { cx } from '../../lib/cx'
import Badge from './Badge'

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}) {
  return (
    <div
      className={cx(
        'flex max-w-2xl flex-col gap-5',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <Badge>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {eyebrow}
        </Badge>
      ) : null}
      <h2
        id={id}
        className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-ink-2 sm:text-lg">{description}</p>
      ) : null}
    </div>
  )
}
