import { useEffect, useState } from 'react'
import AddCourseModal from '../components/AddCourseModal'
import CourseListItem from '../components/CourseListItem'
import CoursesHeaderRow from '../components/CoursesHeaderRow'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`)
        if (!response.ok) throw new Error('Failed to load courses')
        const data = await response.json()
        setCourses(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load courses:', error)
      }
    }

    void loadCourses()
  }, [])

  const handleCreateCourseSubmit = async (payload) => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      let message = 'Failed to create course'
      try {
        const errorData = await response.json()
        message = errorData.error || errorData.message || message
      } catch {
        // ignore parse errors
      }
      throw new Error(message)
    }

    const createdCourse = await response.json()
    setCourses((prev) => [createdCourse, ...prev])
  }

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <CoursesHeaderRow onAddCourse={() => setIsAddCourseOpen(true)} />

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">All Courses</h3>
          <div className="space-y-2.5">
            {courses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onSubmit={handleCreateCourseSubmit}
      />
    </>
  )
}

export default CoursesPage
