import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import TaskDetail from './TaskDetail'

const Dashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Görevleri yükle
  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const result = await window.api.tasks.getAll(user.id)
      if (result.success) {
        setTasks(result.tasks)
        setError('')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('Görevler yüklenirken bir hata oluştu.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [user.id])

  // Yeni görev ekle
  const handleAddTask = async (taskData) => {
    try {
      const result = await window.api.tasks.add({
        ...taskData,
        UserId: user.id
      })

      if (result.success) {
        setTasks([result.task, ...tasks])
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Görev eklenirken bir hata oluştu.'
      setError(errorMessage)
      console.error(error)
      return { success: false, error: errorMessage }
    }
  }

  // Görev güncelle
  const handleUpdateTask = async (taskData) => {
    try {
      const result = await window.api.tasks.update(taskData)

      if (result.success) {
        setTasks(tasks.map((task) => (task.id === result.task.id ? result.task : task)))
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Görev güncellenirken bir hata oluştu.'
      setError(errorMessage)
      console.error(error)
      return { success: false, error: errorMessage }
    }
  }

  // Görev sil
  const handleDeleteTask = async (taskId) => {
    try {
      const result = await window.api.tasks.delete(taskId)

      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
        return { success: true }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Görev silinirken bir hata oluştu.'
      setError(errorMessage)
      console.error(error)
      return { success: false, error: errorMessage }
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <Routes>
              <Route
                path="/"
                element={
                  <TaskList
                    tasks={tasks}
                    isLoading={isLoading}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                  />
                }
              />
              <Route path="/add" element={<TaskForm onSubmit={handleAddTask} />} />
              <Route
                path="/edit/:taskId"
                element={<TaskForm tasks={tasks} onSubmit={handleUpdateTask} isEditMode={true} />}
              />
              <Route
                path="/task/:taskId"
                element={
                  <TaskDetail
                    tasks={tasks}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                  />
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
