import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  validateUsername,
  validateEmail,
  validatePhone,
  validatePassword,
} from '../utils/validators'

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', phoneNumber: '', password: ''
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // clear field error on typing
    if (errors[e.target.name])
      setErrors(p => ({ ...p, [e.target.name]: '' }))
    setApiError('')
  }

const validate = () => {
  const e = {}

  const usernameErr = validateUsername(form.username)
  if (usernameErr) e.username = usernameErr

  if (!form.email.trim() && !form.phoneNumber.trim()) {
    e.contact = 'Please provide an email or phone number'
  }

  if (form.email.trim()) {
    const emailErr = validateEmail(form.email)
    if (emailErr) e.email = emailErr
  }

  if (form.phoneNumber.trim()) {
    const phoneErr = validatePhone(form.phoneNumber)
    if (phoneErr) e.phoneNumber = phoneErr
  }

  const passErr = validatePassword(form.password)
  if (passErr) e.password = passErr

  return e
}

  const handleSubmit = async (e) => {
  e.preventDefault()
  setApiError('')
  const e2 = validate()
  if (Object.keys(e2).length > 0) { setErrors(e2); return }

  setLoading(true)
  try {
    // triple-check: null if empty, never send ""
    const emailVal       = form.email.trim()       || null
    const phoneVal       = form.phoneNumber.trim() || null

    // frontend guard — should never reach backend with both null
    if (!emailVal && !phoneVal) {
      setErrors(p => ({ ...p,
        contact: 'Please provide an email or phone number' }))
      setLoading(false)
      return
    }

    const payload = {
      username:    form.username.trim(),
      password:    form.password,
      email:       emailVal,
      phoneNumber: phoneVal,
    }

    // log the payload so you can inspect in browser console
    console.log('Register payload:', JSON.stringify(payload))

    const res = await api.post('/auth/register', payload)
    const { token, username, email } = res.data.data
    login({ username, email }, token)
    navigate('/dashboard')
  } catch (err) {
    const msg = err.response?.data?.message || ''
    const msgLower = msg.toLowerCase()

    console.log('Register error:', msg)

    if (msgLower.includes('username')) {
      setErrors(p => ({ ...p, username: msg }))
    } else if (msgLower.includes('valid email')) {
      setErrors(p => ({ ...p, email: msg }))
    } else if (msgLower.includes('email')) {
      setErrors(p => ({ ...p, email: msg }))
    } else if (msgLower.includes('phone')) {
      setErrors(p => ({ ...p, phoneNumber: msg }))
    } else if (msgLower.includes('email or phone')) {
      setErrors(p => ({ ...p, contact: msg }))
    } else {
      setApiError(msg || 'Registration failed. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  const inputErr = (key) => errors[key] ? {
    borderColor: 'rgba(255,0,153,0.6)',
    background:  'rgba(255,0,153,0.05)',
    boxShadow:   '0 0 0 3px rgba(255,0,153,0.1)',
  } : {}

  const ErrMsg = ({ field }) => errors[field]
    ? <div style={{ color:'var(--pink)', fontSize:11, marginTop:4 }}>⚠ {errors[field]}</div>
    : null

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

        {/* top glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg,transparent,var(--pink),transparent)',
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
          <h2 style={{
            fontFamily: "'Syne',sans-serif", fontSize: 22,
            fontWeight: 700, marginBottom: 4,
          }}>Create account</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            Fields marked * are required
          </p>
        </div>

        {/* API ERROR */}
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
            <span>⚠</span>{apiError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Username *</label>
            <input className="form-input" name="username"
              placeholder="johndoe" value={form.username}
              onChange={handleChange} style={inputErr('username')} />
            <ErrMsg field="username" />
          </div>

          {/* EMAIL */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">
              Email
              <span style={{ color:'var(--muted)', fontWeight:400,
                marginLeft:6, textTransform:'none', letterSpacing:0 }}>
                (required if no phone)
              </span>
            </label>
            <input className="form-input" name="email" type="email"
              placeholder="john@example.com" value={form.email}
              onChange={handleChange} style={inputErr('email')} />
            <ErrMsg field="email" />
          </div>

          {/* DIVIDER */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 16, color: 'var(--muted)', fontSize: 12,
          }}>
            <div style={{ flex:1, height:1, background:'var(--glass-border)' }}/>
            OR
            <div style={{ flex:1, height:1, background:'var(--glass-border)' }}/>
          </div>

          {/* PHONE */}
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">
              Phone Number
              <span style={{ color:'var(--muted)', fontWeight:400,
                marginLeft:6, textTransform:'none', letterSpacing:0 }}>
                (required if no email)
              </span>
            </label>
            <input className="form-input" name="phoneNumber"
              placeholder="+1 234 567 890" value={form.phoneNumber}
              onChange={handleChange} style={inputErr('phoneNumber')} />
            <ErrMsg field="phoneNumber" />
          </div>

          {/* CONTACT ERROR — shown when neither email nor phone provided */}
          {errors.contact && (
            <div style={{
              padding: '10px 14px', borderRadius: 10, marginBottom: 16,
              background: 'rgba(255,0,153,0.1)',
              border: '1px solid rgba(255,0,153,0.3)',
              color: 'var(--pink)', fontSize: 13,
            }}>⚠ {errors.contact}</div>
          )}

          {/* PASSWORD */}
          <div style={{ marginBottom: 28 }}>
            <label className="form-label">Password *</label>
            <input className="form-input" name="password" type="password"
              placeholder="Min 6 characters" value={form.password}
              onChange={handleChange} style={inputErr('password')} />
            <ErrMsg field="password" />
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: '0 0 50px rgba(255,0,153,0.5)' }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: 15, borderRadius: 12,
              background: loading
                ? 'rgba(255,0,153,0.3)'
                : 'linear-gradient(135deg,var(--pink),#7700ff)',
              color: 'white', fontFamily: "'Syne',sans-serif",
              fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 30px rgba(255,0,153,0.3)',
              transition: 'all 0.3s',
            }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </motion.button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:14, color:'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--pink)', textDecoration:'none', fontWeight:500 }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}