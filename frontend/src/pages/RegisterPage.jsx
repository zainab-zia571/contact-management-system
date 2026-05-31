import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', phoneNumber: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email && !form.phoneNumber) {
      return setError('Please provide an email or phone number')
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      const { token, username, email } = res.data.data
      login({ username, email }, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { marginBottom: 20 }

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
        style={{ width: '100%', maxWidth: 480, padding: 40, position: 'relative' }}>

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--pink),transparent)',
          borderRadius: '20px 20px 0 0',
        }} />

        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            Create account
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Join thousands of professionals</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
            background: 'rgba(255,0,153,0.1)', border: '1px solid rgba(255,0,153,0.3)',
            color: 'var(--pink)', fontSize: 14,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={inputStyle}>
            <label className="form-label">Username</label>
            <input className="form-input" name="username"
              placeholder="johndoe" required
              value={form.username} onChange={handleChange} />
          </div>

          <div style={inputStyle}>
            <label className="form-label">Email</label>
            <input className="form-input" name="email" type="email"
              placeholder="john@example.com"
              value={form.email} onChange={handleChange} />
          </div>

          <div style={inputStyle}>
            <label className="form-label">Phone Number (optional if email provided)</label>
            <input className="form-input" name="phoneNumber"
              placeholder="+1 234 567 890"
              value={form.phoneNumber} onChange={handleChange} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Password</label>
            <input className="form-input" name="password" type="password"
              placeholder="Min 6 characters" required
              value={form.password} onChange={handleChange} />
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(255,0,153,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: 15, borderRadius: 12,
              background: 'linear-gradient(135deg,var(--pink),#7700ff)',
              color: 'white', fontFamily: "'Syne',sans-serif",
              fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(255,0,153,0.3)',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--pink)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}