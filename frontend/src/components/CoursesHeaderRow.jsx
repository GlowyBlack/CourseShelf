function CoursesHeaderRow({ onAddCourse }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Courses</h2>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        onClick={onAddCourse}
      >
        Add Course +
      </button>
    </div>
  )
}

export default CoursesHeaderRow
