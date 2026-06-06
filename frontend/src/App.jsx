import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import Cursor from './components/Cursor'
import ParticlesBg from './components/Particles'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ContactListPage from './pages/ContactListPage'
import ContactDetailPage from './pages/ContactDetailPage'
import PropTypes from 'prop-types'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

function AppRoutes() {
  return (
    <>
      <Cursor />
      <ParticlesBg />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/contacts/:type" element={
          <PrivateRoute><ContactListPage /></PrivateRoute>
        } />
        <Route path="/contact/:id" element={
          <PrivateRoute><ContactDetailPage /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{
          background: 'rgba(20,20,50,0.95)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: 14,
          color: '#f0f0ff',
        }}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}