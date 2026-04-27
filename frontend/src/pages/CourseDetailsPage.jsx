import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialFormModal from '../components/MaterialFormModal'
import MaterialListItem from '../components/MaterialListItem'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function CourseDetailsPage() {
  const { courseId } = useParams()
  const parsedCourseId = Number(courseId)

  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseMaterials, setCourseMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (!Number.isInteger(parsedCourseId) || parsedCourseId <= 0) {
        setSelectedCourse(null)
        setCourseMaterials([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${parsedCourseId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setSelectedCourse(null)
            setCourseMaterials([])
            return
          }
          throw new Error('Failed to load course details')
        }

        const data = await response.json()
        setSelectedCourse({
          id: data.id,
          name: data.name,
          department: data.department,
          term: data.term,
        })
        setCourseMaterials(data.materials ?? [])
      } catch (error) {
        console.error('Failed to load course details:', error)
        setSelectedCourse(null)
        setCourseMaterials([])
      } finally {
        setIsLoading(false)
      }
    }

    void loadCourseDetails()
  }, [parsedCourseId])

  const handleCreateMaterial = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/courses/${parsedCourseId}/materials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let message = 'Failed to create material'
      try {
        const errorData = await response.json()
        message = errorData.error || errorData.message || message
      } catch {
        // ignore parse errors
      }
      throw new Error(message)
    }

    const createdMaterial = await response.json()
    setCourseMaterials((prev) => [createdMaterial, ...prev])
  }

  const handleEditMaterialOpen = (material) => {
    setEditingMaterial(material)
    setIsEditMaterialOpen(true)
  }

  const handleEditMaterialSubmit = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/courses/${parsedCourseId}/materials`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        materialId: payload.id,
        title: payload.title,
        type: payload.type,
        description: payload.description,
        link: payload.link,
      }),
    })

    if (!response.ok) {
      let message = 'Failed to update material'
      try {
        const errorData = await response.json()
        message = errorData.error || errorData.message || message
      } catch {
        // ignore parse errors
      }
      throw new Error(message)
    }

    const updatedMaterial = await response.json()
    setCourseMaterials((prev) =>
      prev.map((item) => (item.id === updatedMaterial.id ? updatedMaterial : item))
    )
  }

  const handleDeleteMaterial = async (material) => {
    const confirmed = window.confirm(`Delete "${material.title}"?`)
    if (!confirmed) return

    const response = await fetch(`${API_BASE_URL}/courses/${parsedCourseId}/materials`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materialId: material.id }),
    })

    if (!response.ok) {
      let message = 'Failed to delete material'
      try {
        const errorData = await response.json()
        message = errorData.error || errorData.message || message
      } catch {
        // ignore parse errors
      }
      window.alert(message)
      return
    }

    setCourseMaterials((prev) => prev.filter((item) => item.id !== material.id))
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="text-sm text-slate-500">Loading course details...</p>
      </main>
    )
  }

  if (!selectedCourse) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          Course not found.
        </div>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to Courses
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{selectedCourse.name}</h2>
          <p className="text-sm text-slate-500">
            {selectedCourse.department} | {selectedCourse.term}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
            Back
          </Link>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            onClick={() => setIsAddMaterialOpen(true)}
          >
            Add Material +
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Materials</h3>
        <div className="space-y-2.5">
          {courseMaterials.map((material) => (
            <MaterialListItem
              key={material.id}
              material={material}
              onEdit={handleEditMaterialOpen}
              onDelete={handleDeleteMaterial}
            />
          ))}
        </div>
      </section>

      <MaterialFormModal
        isOpen={isAddMaterialOpen}
        mode="add"
        onClose={() => setIsAddMaterialOpen(false)}
        onSubmit={handleCreateMaterial}
      />

      <MaterialFormModal
        isOpen={isEditMaterialOpen}
        mode="edit"
        material={editingMaterial}
        onClose={() => setIsEditMaterialOpen(false)}
        onSubmit={handleEditMaterialSubmit}
      />
    </main>
  )
}

export default CourseDetailsPage
