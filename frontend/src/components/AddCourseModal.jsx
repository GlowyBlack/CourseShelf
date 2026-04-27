import { useState } from 'react'

const initialForm = {
  name: '',
  department: '',
  termSeason: 'W',
  semester: 1,
  year: new Date().getFullYear(),
}

function AddCourseModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit?.(form)
      setForm(initialForm)
      onClose?.()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to add course')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Add Course</h3>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Course name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
            required
          />
          <div className="grid grid-cols-3 gap-2">
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={form.termSeason}
              onChange={(e) => setForm((prev) => ({ ...prev, termSeason: e.target.value }))}
            >
              <option value="W">Winter</option>
              <option value="S">Summer</option>
            </select>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={form.semester}
              onChange={(e) => setForm((prev) => ({ ...prev, semester: Number(e.target.value) }))}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            <input
              type="number"
              min={1900}
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
              required
            />
          </div>

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
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourseModal
