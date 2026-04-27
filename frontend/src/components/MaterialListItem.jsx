import { useState } from 'react'

function MaterialListItem({ material, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const rawLink = material.link?.trim() ?? ''
  const normalizedLink =
    rawLink && /^https?:\/\//i.test(rawLink) ? rawLink : rawLink ? `https://${rawLink}` : ''

  const handleEditClick = () => {
    setIsMenuOpen(false)
    onEdit?.(material)
  }

  const handleDeleteClick = () => {
    setIsMenuOpen(false)
    onDelete?.(material)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-left">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="font-semibold text-slate-900">{material.title}</div>
        <div className="relative">
          <button
            type="button"
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Material actions"
          >
            ⋮
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                className="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                type="button"
                className="block w-full px-3 py-1.5 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">{material.type}</div>
      <div className="text-sm text-slate-700">{material.description}</div>
      {normalizedLink ? (
        <a
          href={normalizedLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open link
        </a>
      ) : null}
    </div>
  )
}

export default MaterialListItem
