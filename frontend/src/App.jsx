import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AddCourseModal from './components/AddCourseModal'
import MaterialFormModal from './components/MaterialFormModal'
import CourseDetailsPage from './pages/CourseDetailsPage'
import CoursesPage from './pages/CoursesPage'

function App() {
  const [courses] = useState([
    { id: 1, name: 'Intro to Algorithms', department: 'CS', term: '2026W1' },
    { id: 2, name: 'Database Systems', department: 'CS', term: '2026S1' },
  ])

  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: 'Week 1 Lecture Notes',
      type: 'Lecture Notes',
      description: 'Big-O notation and asymptotic analysis.',
      link: 'https://example.com/algorithms/week-1',
      courseId: 1,
    },
    {
      id: 2,
      title: 'Assignment 1',
      type: 'Assignment',
      description: 'Solve sorting and searching practice problems.',
      link: '',
      courseId: 1,
    },
  ])

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false)
  const [activeCourseIdForModal, setActiveCourseIdForModal] = useState(1)
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)

  const openAddMaterialModal = (courseId) => {
    setActiveCourseIdForModal(courseId)
    setIsAddMaterialOpen(true)
  }

  const openEditMaterialModal = (material) => {
    setEditingMaterial(material)
    setIsEditMaterialOpen(true)
  }

  const handleDeleteMaterial = (material) => {
    const confirmed = window.confirm(`Delete "${material.title}"?`)
    if (!confirmed) return

    setMaterials((prev) => prev.filter((item) => item.id !== material.id))
  }

  const handleEditMaterialSubmit = (payload) => {
    setMaterials((prev) =>
      prev.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              title: payload.title,
              type: payload.type,
              description: payload.description,
              link: payload.link,
            }
          : item
      )
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<CoursesPage courses={courses} onOpenAddCourse={() => setIsAddCourseOpen(true)} />} />
        <Route
          path="/courses/:courseId"
          element={
            <CourseDetailsPage
              courses={courses}
              materials={materials}
              onOpenAddMaterial={openAddMaterialModal}
              onEditMaterial={openEditMaterialModal}
              onDeleteMaterial={handleDeleteMaterial}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AddCourseModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
        onSubmit={(payload) => console.log('Create course payload:', payload)}
      />

      <MaterialFormModal
        isOpen={isAddMaterialOpen}
        mode="add"
        onClose={() => setIsAddMaterialOpen(false)}
        onSubmit={(payload) =>
          console.log('Create material payload:', {
            ...payload,
            courseId: activeCourseIdForModal,
          })
        }
      />

      <MaterialFormModal
        isOpen={isEditMaterialOpen}
        mode="edit"
        material={editingMaterial}
        onClose={() => setIsEditMaterialOpen(false)}
        onSubmit={handleEditMaterialSubmit}
      />
    </>
  )
}

export default App
