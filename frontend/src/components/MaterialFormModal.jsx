import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  type: 'Lecture Notes',
  description: '',
  link: '',
}

function MaterialFormModal({ isOpen, mode = 'add', material = null, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && material) {
      setForm({
        title: material.title ?? '',
        type: material.type ?? 'Lecture Notes',
        description: material.description ?? '',
        link: material.link ?? '',
      })
      return
    }

    setForm(emptyForm)
  }, [mode, material, isOpen])

  if (!isOpen) return null
  if (mode === 'edit' && !material) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...form,
        link: form.link.trim(),
      }

      if (mode === 'edit' && material) {
        await onSubmit?.({ id: material.id, ...payload })
      } else {
        await onSubmit?.(payload)
      }

      onClose?.()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save material')
    } finally {
      setIsSubmitting(false)
    }
  }

  const titleText = mode === 'edit' ? 'Edit Material' : 'Add Material'
  const submitText = mode === 'edit' ? 'Save changes' : 'Save'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">{titleText}</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <select
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Assignment">Assignment</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Link"
            value={form.link}
            onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
          />

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaterialFormModal
