import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'rgba(15,15,35,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <Link to="/" style={{
        fontFamily: "'Syne', sans-serif", fontSize: 22,
        fontWeight: 800, textDecoration: 'none',
        background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        ◎ TouchBase

      </Link>

      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {!user ? (
          <>
            <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Home</Link>
            <Link to="/login" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Login</Link>
            <Link to="/register" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>Dashboard</Link>
            <button onClick={handleLogout} style={{
              padding: '10px 24px', borderRadius: 100,
              background: 'linear-gradient(135deg,var(--pink),#7700ff)',
              color: 'white', fontWeight: 600, fontSize: 14,
              border: 'none', cursor: 'pointer',
            }}>
              Logout
            </button>
          </>
        )}
        {!user && (
          <Link to="/register">
            <button style={{
              padding: '10px 24px', borderRadius: 100,
              background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
              color: 'var(--indigo)', fontWeight: 600, fontSize: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,229,255,0.3)',
            }}>
              Get Started →
            </button>
          </Link>
        )}
      </div>
    </motion.nav>
  )
}