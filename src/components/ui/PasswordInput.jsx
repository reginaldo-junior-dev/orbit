import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input'

export default function PasswordInput({
  id,
  label,
  labelAction,
  error,
  hint,
  value,
  onChange,
  disabled,
  autoComplete,
  placeholder,
  ...props
}) {
  const [show, setShow] = useState(false)

  return (
    <Input
      id={id}
      type={show ? 'text' : 'password'}
      label={label}
      labelAction={labelAction}
      error={error}
      hint={hint}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      placeholder={placeholder}
      rightSlot={
        <button
          type="button"
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-surface hover:text-ink-2 focus-visible:focus-ring"
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          onClick={() => setShow((visible) => !visible)}
          disabled={disabled}
        >
          {show ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      }
      {...props}
    />
  )
}
