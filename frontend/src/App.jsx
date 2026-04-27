import { Navigate, Route, Routes } from 'react-router-dom'
import CourseDetailsPage from './pages/CourseDetailsPage'
import CoursesPage from './pages/CoursesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CoursesPage />} />
      <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
