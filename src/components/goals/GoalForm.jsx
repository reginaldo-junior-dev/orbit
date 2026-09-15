import { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from '../ui/Button'
import FormNotice from '../ui/FormNotice'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

export default function GoalForm({
  initial,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [targetDate, setTargetDate] = useState(initial?.targetDate ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'ACTIVE')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const titleRef = useRef(null)

  const busy = submitting || success

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const nextErrors = {}
    if (!title.trim()) nextErrors.title = 'Title is required'
    setFieldErrors(nextErrors)
    if (nextErrors.title) {
      titleRef.current?.focus()
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        targetDate: targetDate || null,
        status,
      })
      setSuccess(true)
      onSuccess?.()
    } catch (error) {
      if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
        setFieldErrors(error.fieldErrors)
      } else {
        setFormError(error.message)
      }
      setSubmitting(false)
    }
  }

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  return (
    <form
      className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
      onSubmit={handleSubmit}
      noValidate
    >
      {success ? <FormNotice className="mb-6">{successMessage}</FormNotice> : null}

      {formError ? <FormNotice tone="error" className="mb-6">{formError}</FormNotice> : null}

      <div className="flex flex-col gap-5">
        <Input
          ref={titleRef}
          id="goal-title"
          label="Title"
          placeholder="e.g. Read 12 books this year"
          autoFocus
          error={fieldErrors.title}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            clearFieldError('title')
          }}
          disabled={busy}
        />

        <Textarea
          id="goal-description"
          label="Description"
          hint="Optional — what does success look like?"
          placeholder="Add details…"
          rows={4}
          error={fieldErrors.description}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value)
            clearFieldError('description')
          }}
          disabled={busy}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="goal-target-date"
            type="date"
            label="Target date"
            hint="Optional — when do you want to get there?"
            className="[color-scheme:dark]"
            error={fieldErrors.targetDate}
            value={targetDate}
            onChange={(event) => {
              setTargetDate(event.target.value)
              clearFieldError('targetDate')
            }}
            disabled={busy}
          />

          <Select
            id="goal-status"
            label="Status"
            className="w-full"
            error={fieldErrors.status}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={busy}
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button type="submit" size="md" disabled={busy}>
          {submitting ? (
            <>
              <LoaderCircle
                className="animate-spin h-4 w-4 motion-reduce:animate-none"
                aria-hidden="true"
              />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  )
}
