import { cx } from '../../lib/cx'

const variants = {
  primary:
    'bg-accent text-bg hover:bg-accent-hover active:bg-accent-active shadow-[0_0_28px_rgba(139,124,255,0.35)] hover:shadow-[0_0_36px_rgba(157,144,255,0.45)]',
  outline:
    'border border-line-strong bg-transparent text-ink hover:border-accent/60 hover:bg-surface',
  ghost: 'bg-transparent text-ink-2 hover:bg-surface hover:text-ink',
  success:
    'bg-success text-bg hover:bg-success/90 shadow-[0_0_28px_rgba(74,222,128,0.3)]',
  danger:
    'bg-error text-bg hover:bg-error/90 shadow-[0_0_28px_rgba(248,113,113,0.25)]',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
}

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const classes = cx(
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:focus-ring active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100',
    variants[variant],
    sizes[size],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
