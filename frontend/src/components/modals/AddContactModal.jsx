import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'

export default function AddContactModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', title: '',
    emails: [{ emailAddress: '', label: 'work' }],
    phones: [{ phoneNumber: '', label: 'work' }],
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await api.post('/contacts', form)
      onAdded()
      onClose()
      setForm({ firstName: '', lastName: '', title: '',
        emails: [{ emailAddress: '', label: 'work' }],
        phones: [{ phoneNumber: '', label: 'work' }] })
    } catch (err) {
      console.error(err)
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
            style={{ width: '90%', maxWidth: 480, padding: 40, position: 'relative',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,229,255,0.2)' }}>

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
              borderRadius: '20px 20px 0 0' }} />

            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16,
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              color: 'var(--muted)', cursor: 'pointer', fontSize: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Add new contact
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28 }}>Fill in the details below</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="form-label">First Name</label>
                <input className="form-input" name="firstName" placeholder="Jane"
                  value={form.firstName} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input className="form-input" name="lastName" placeholder="Smith"
                  value={form.lastName} onChange={handleChange} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Title / Role</label>
              <input className="form-input" name="title" placeholder="Senior Manager"
                value={form.title} onChange={handleChange} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="jane@company.com"
                value={form.emails[0].emailAddress}
                onChange={e => setForm({ ...form, emails: [{ ...form.emails[0], emailAddress: e.target.value }] })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+1 234 567 890"
                  value={form.phones[0].phoneNumber}
                  onChange={e => setForm({ ...form, phones: [{ ...form.phones[0], phoneNumber: e.target.value }] })} />
              </div>
              <div>
                <label className="form-label">Label</label>
                <select className="form-input" style={{ appearance: 'none' }}
                  value={form.phones[0].label}
                  onChange={e => setForm({ ...form, phones: [{ ...form.phones[0], label: e.target.value }] })}>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="home">Home</option>
                </select>
              </div>
            </div>

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
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? 'Saving...' : 'Save Contact'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}