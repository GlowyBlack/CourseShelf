import { Link } from 'react-router-dom'

function CourseListItem({ course }) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left no-underline transition hover:border-slate-300 hover:bg-slate-100"
    >
      <div className="font-semibold text-slate-900">{course.name}</div>
      <div className="text-sm text-slate-500">
        {course.department} | {course.term}
      </div>
    </Link>
  )
}

export default CourseListItem
