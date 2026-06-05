import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'
import PropTypes from 'prop-types'


export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (form.newPassword !== form.confirm) return setError('Passwords do not match')
    if (form.newPassword.length < 6) return setError('Min 6 characters')
    setLoading(true)
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      onClose()
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally { setLoading(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <motion.div initial={{ y: 20, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.97 }}
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{ width: '90%', maxWidth: 440, padding: 40, position: 'relative',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,229,255,0.2)' }}>

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
              borderRadius: '20px 20px 0 0' }} />

            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16, width: 32, height: 32,
              borderRadius: '50%', background: 'var(--glass)',
              border: '1px solid var(--glass-border)', color: 'var(--muted)',
              cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Change password
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Choose a strong new password</p>

            {error && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20,
              background: 'rgba(255,0,153,0.1)', border: '1px solid rgba(255,0,153,0.3)',
              color: 'var(--pink)', fontSize: 14 }}>{error}</div>}

            {['currentPassword', 'newPassword', 'confirm'].map((field, i) => (
              <div key={field} style={{ marginBottom: i === 2 ? 28 : 16 }}>
                <label className="form-label">
                  {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                </label>
                <input className="form-input" type="password" placeholder="••••••••"
                  value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: 14, borderRadius: 12,
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 600,
              }}>Cancel</button>
              <motion.button onClick={handleSubmit} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: 14, borderRadius: 12,
                  background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
                  color: 'var(--indigo)', border: 'none', cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 700,
                }}>
                {loading ? 'Updating...' : 'Update Password'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ChangePasswordModal.propTypes = {
  open:    PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}