import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { identifier, password })
      const { token, username, email } = res.data.data
      login({ username, email }, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '120px 24px 80px', position: 'relative', zIndex: 2,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 440, padding: 40, position: 'relative' }}>

        {/* TOP GLOW LINE */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Sign in to your Nexus account</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
            background: 'rgba(255,0,153,0.1)', border: '1px solid rgba(255,0,153,0.3)',
            color: 'var(--pink)', fontSize: 14,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Email, Username or Phone</label>
            <input className="form-input" type="text"
              placeholder="john@example.com"
              value={identifier} onChange={e => setIdentifier(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(0,229,255,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: 15, borderRadius: 12,
              background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
              color: 'var(--indigo)', fontFamily: "'Syne',sans-serif",
              fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0,229,255,0.3)',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}