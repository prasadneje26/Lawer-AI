import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './lib/store'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CaseSearch from './pages/CaseSearch'
import LawSections from './pages/LawSections'
import Documents from './pages/Documents'
import Predictions from './pages/Predictions'
import Analytics from './pages/Analytics'
import Admin from './pages/Admin'

function App() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/case-search" element={<Layout><CaseSearch /></Layout>} />
      <Route path="/law-sections" element={<Layout><LawSections /></Layout>} />
      <Route path="/documents" element={<Layout><Documents /></Layout>} />
      <Route path="/predictions" element={<Layout><Predictions /></Layout>} />
      <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
      <Route path="/admin" element={<Layout requireAdmin><Admin /></Layout>} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
