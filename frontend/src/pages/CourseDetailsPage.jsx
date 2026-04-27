import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import MaterialListItem from '../components/MaterialListItem'

function CourseDetailsPage({ courses, materials, onOpenAddMaterial, onEditMaterial, onDeleteMaterial }) {
  const { courseId } = useParams()
  const parsedCourseId = Number(courseId)

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === parsedCourseId),
    [courses, parsedCourseId]
  )

  const courseMaterials = useMemo(
    () => materials.filter((material) => material.courseId === parsedCourseId),
    [materials, parsedCourseId]
  )

  if (!Number.isInteger(parsedCourseId) || !selectedCourse) {
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
            onClick={() => onOpenAddMaterial(parsedCourseId)}
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
              onEdit={onEditMaterial}
              onDelete={onDeleteMaterial}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default CourseDetailsPage
