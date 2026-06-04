import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!identifier.trim()) e.identifier = 'Email, username or phone is required'
    if (!password.trim()) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { identifier, password })
      const { token, username, email } = res.data.data
      login({ username, email }, token)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || ''
      if (err.response?.status === 400 || err.response?.status === 401) {
        setApiError('Incorrect email/username or password. Please try again.')
      } else if (err.response?.status === 404) {
        setApiError('No account found with these credentials.')
      } else {
        setApiError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputErr = (key) => errors[key] ? {
    borderColor: 'rgba(255,0,153,0.6)',
    background: 'rgba(255,0,153,0.05)',
    boxShadow: '0 0 0 3px rgba(255,0,153,0.1)',
  } : {}

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

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800,
            background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}>◎ TouchBase</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Sign in to your account</p>
        </div>

        {/* API ERROR BANNER */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px', borderRadius: 12, marginBottom: 20,
              background: 'rgba(255,0,153,0.1)',
              border: '1px solid rgba(255,0,153,0.4)',
              color: 'var(--pink)', fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            <span style={{ fontSize: 18 }}>⚠</span>
            {apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* IDENTIFIER */}
          <div style={{ marginBottom: 6 }}>
            <label className="form-label">Email, Username or Phone</label>
            <input className="form-input" type="text"
              placeholder="john@example.com"
              value={identifier}
              onChange={e => {
                setIdentifier(e.target.value)
                setApiError('')
                if (errors.identifier) setErrors(p => ({ ...p, identifier: '' }))
              }}
              style={inputErr('identifier')} />
            {errors.identifier && (
              <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>
                ⚠ {errors.identifier}
              </div>
            )}
          </div>

          {/* PASSWORD */}
          <div style={{ marginBottom: 28, marginTop: 16 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setApiError('')
                if (errors.password) setErrors(p => ({ ...p, password: '' }))
              }}
              style={inputErr('password')} />
            {errors.password && (
              <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>
                ⚠ {errors.password}
              </div>
            )}
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(0,229,255,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: 15, borderRadius: 12,
              background: loading
                ? 'rgba(0,229,255,0.3)'
                : 'linear-gradient(135deg,var(--cyan),#0088ff)',
              color: 'var(--indigo)', fontFamily: "'Syne',sans-serif",
              fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0,229,255,0.3)',
              transition: 'all 0.3s',
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