import { useRef, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import Button from '../ui/Button'
import FormNotice from '../ui/FormNotice'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

export default function TaskForm({
  initial,
  projects,
  submitLabel,
  successMessage,
  onSubmit,
  onCancel,
  onSuccess,
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState(initial?.status ?? 'TODO')
  const [priority, setPriority] = useState(initial?.priority ?? 'MEDIUM')
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '')
  const [projectId, setProjectId] = useState(initial?.projectId ?? '')
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
        status,
        priority,
        dueDate: dueDate || null,
        projectId: projectId || null,
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
          id="task-title"
          label="Title"
          placeholder="What needs to be done?"
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
          id="task-description"
          label="Description"
          hint="Optional — add any extra context or details."
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
          <Select
            id="task-status"
            label="Status"
            className="w-full"
            error={fieldErrors.status}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            disabled={busy}
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </Select>

          <Select
            id="task-priority"
            label="Priority"
            className="w-full"
            error={fieldErrors.priority}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            disabled={busy}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </Select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            id="task-due-date"
            type="date"
            label="Due date"
            className="[color-scheme:dark]"
            error={fieldErrors.dueDate}
            value={dueDate}
            onChange={(event) => {
              setDueDate(event.target.value)
              clearFieldError('dueDate')
            }}
            disabled={busy}
          />

          <Select
            id="task-project"
            label="Project"
            className="w-full"
            error={fieldErrors.projectId}
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            disabled={busy}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
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
