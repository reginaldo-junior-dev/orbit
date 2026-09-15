import { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from '../ui/Button'
import FormNotice from '../ui/FormNotice'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

export default function ProjectForm({
  initial,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'ACTIVE')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const nameRef = useRef(null)

  const busy = submitting || success

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return

    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Name is required'
    setFieldErrors(nextErrors)
    if (nextErrors.name) {
      nameRef.current?.focus()
      return
    }

    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
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
          ref={nameRef}
          id="project-name"
          label="Name"
          placeholder="e.g. Website revamp"
          autoFocus
          error={fieldErrors.name}
          value={name}
          onChange={(event) => {
            setName(event.target.value)
            clearFieldError('name')
          }}
          disabled={busy}
        />

        <Textarea
          id="project-description"
          label="Description"
          hint="Optional — what is this project about?"
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

        <Select
          id="project-status"
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
