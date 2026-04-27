import CourseListItem from '../components/CourseListItem'
import CoursesHeaderRow from '../components/CoursesHeaderRow'

function CoursesPage({ courses, onOpenAddCourse }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <CoursesHeaderRow onAddCourse={onOpenAddCourse} />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-900">All Courses</h3>
        <div className="space-y-2.5">
          {courses.map((course) => (
            <CourseListItem key={course.id} course={course} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default CoursesPage
