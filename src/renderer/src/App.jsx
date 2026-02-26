import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Auth from './components/Auth'

import ProjectList from './components/Projects/ProjectList'
import ProjectForm from './components/Projects/ProjectForm'
import ProjectDetail from './components/Projects/ProjectDetail'
import Dashboard from './components/Dashboard/Dashboard'
import { useState } from 'react'
import AdminPage from './components/Admin/AdminPage'
import CSVMainPage from './components/CSVReader/CSVMainPage'

function App() {
  const [user, setUser] = useState({ id: 1, name: 'User' })
  // const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  const onLogout = () => {
    window.electron.ipcRenderer.send('user:logout')
  }

  const onLogin = (user) => {
    setUser(user)
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth onLogin={onLogin} />} />

        <Route path="/csv-analyzer" element={<CSVMainPage />} />

        {/* Proje Route'ları */}
        <Route path="projects" element={<Dashboard user={user} onLogout={onLogout} />}>
          <Route index element={<ProjectList user={user} />} />
          <Route path="add" element={<ProjectForm user={user} />} />
          <Route path="edit/:projectId" element={<ProjectForm user={user} />} />
          <Route path=":projectId" element={<ProjectDetail />} />
        </Route>

        {/* Admin Route'ları - Sadece Claim Manager görebilir */}
        {user.role === 'Claim Manager' && (
          <>
            <Route path="admin" element={<Dashboard user={user} />}>
              <Route index element={<AdminPage user={user} />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
