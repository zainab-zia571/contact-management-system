import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'

const emptyEmail = () => ({ emailAddress: '', label: 'work' })
const emptyPhone = () => ({ phoneNumber: '', label: 'work' })

export default function AddContactModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', title: '',
    emails: [emptyEmail()],
    phones: [emptyPhone()],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    form.emails.forEach((em, i) => {
      if (!em.emailAddress.trim()) e[`email_${i}`] = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(em.emailAddress))
        e[`email_${i}`] = 'Enter a valid email'
    })
    form.phones.forEach((ph, i) => {
      if (!ph.phoneNumber.trim()) e[`phone_${i}`] = 'Phone number is required'
    })
    return e
  }

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const updateEmail = (i, field, value) => {
    const updated = [...form.emails]
    updated[i] = { ...updated[i], [field]: value }
    setForm({ ...form, emails: updated })
    if (errors[`email_${i}`])
      setErrors(prev => { const n = { ...prev }; delete n[`email_${i}`]; return n })
  }

  const updatePhone = (i, field, value) => {
    const updated = [...form.phones]
    updated[i] = { ...updated[i], [field]: value }
    setForm({ ...form, phones: updated })
    if (errors[`phone_${i}`])
      setErrors(prev => { const n = { ...prev }; delete n[`phone_${i}`]; return n })
  }

  const addEmail = () => setForm({ ...form, emails: [...form.emails, emptyEmail()] })
  const addPhone = () => setForm({ ...form, phones: [...form.phones, emptyPhone()] })
  const removeEmail = i => setForm({ ...form, emails: form.emails.filter((_, idx) => idx !== i) })
  const removePhone = i => setForm({ ...form, phones: form.phones.filter((_, idx) => idx !== i) })

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setLoading(true)
    try {
      await api.post('/contacts', form)
      onAdded()
      onClose()
      setForm({ firstName: '', lastName: '', title: '',
        emails: [emptyEmail()], phones: [emptyPhone()] })
      setErrors({})
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to add contact' })
    } finally { setLoading(false) }
  }

  const inputErr = (key) => errors[key] ? {
    borderColor: 'rgba(255,0,153,0.6)',
    background: 'rgba(255,0,153,0.05)',
    boxShadow: '0 0 0 3px rgba(255,0,153,0.1)',
  } : {}

  const LABEL_COLORS = {
    work:     { bg: 'rgba(0,229,255,0.1)',  color: 'var(--cyan)' },
    personal: { bg: 'rgba(255,0,153,0.1)', color: 'var(--pink)' },
    home:     { bg: 'rgba(255,215,0,0.1)', color: 'var(--gold)' },
    mobile:   { bg: 'rgba(119,0,255,0.1)', color: '#aa44ff'     },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}>
          <motion.div
            initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{
              width: '100%', maxWidth: 540, padding: 40, position: 'relative',
              maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5),0 0 40px rgba(0,229,255,0.15)',
            }}>

            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
              borderRadius: '20px 20px 0 0',
            }} />

            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16, width: 32, height: 32,
              borderRadius: '50%', background: 'var(--glass)',
              border: '1px solid var(--glass-border)', color: 'var(--muted)',
              cursor: 'pointer', fontSize: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Add new contact
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
              Fields marked with * are required
            </p>

            {errors.submit && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(255,0,153,0.1)', border: '1px solid rgba(255,0,153,0.3)',
                color: 'var(--pink)', fontSize: 13,
              }}>{errors.submit}</div>
            )}

            {/* NAME */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 4 }}>
              <div>
                <label className="form-label">First Name *</label>
                <input className="form-input" name="firstName" placeholder="Jane"
                  value={form.firstName}
                  onChange={e => { handleChange(e); if (errors.firstName) setErrors(p => ({ ...p, firstName: '' })) }}
                  style={inputErr('firstName')} />
                {errors.firstName && <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>⚠ {errors.firstName}</div>}
              </div>
              <div>
                <label className="form-label">Last Name *</label>
                <input className="form-input" name="lastName" placeholder="Smith"
                  value={form.lastName}
                  onChange={e => { handleChange(e); if (errors.lastName) setErrors(p => ({ ...p, lastName: '' })) }}
                  style={inputErr('lastName')} />
                {errors.lastName && <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>⚠ {errors.lastName}</div>}
              </div>
            </div>

            {/* TITLE */}
            <div style={{ marginBottom: 16, marginTop: 12 }}>
              <label className="form-label">Title / Role</label>
              <input className="form-input" name="title" placeholder="Senior Manager"
                value={form.title} onChange={handleChange} />
            </div>

            {/* EMAILS */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>Email Addresses *</label>
                <button onClick={addEmail} style={{
                  fontSize: 12, color: 'var(--cyan)', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>＋ Add Email</button>
              </div>
              {form.emails.map((em, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8 }}>
                    <input className="form-input" type="email"
                      placeholder="email@example.com"
                      value={em.emailAddress}
                      onChange={e => updateEmail(i, 'emailAddress', e.target.value)}
                      style={inputErr(`email_${i}`)} />
                    <select className="form-input"
                      style={{
                        appearance: 'none', width: 100,
                        background: LABEL_COLORS[em.label]?.bg,
                        color: LABEL_COLORS[em.label]?.color,
                      }}
                      value={em.label}
                      onChange={e => updateEmail(i, 'label', e.target.value)}>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="home">Home</option>
                    </select>
                    {form.emails.length > 1 && (
                      <button onClick={() => removeEmail(i)} style={{
                        width: 36, borderRadius: 8,
                        background: 'rgba(255,0,153,0.1)',
                        border: '1px solid rgba(255,0,153,0.2)',
                        color: 'var(--pink)', cursor: 'pointer',
                      }}>✕</button>
                    )}
                  </div>
                  {errors[`email_${i}`] && (
                    <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>
                      ⚠ {errors[`email_${i}`]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* PHONES */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" style={{ margin: 0 }}>Phone Numbers *</label>
                <button onClick={addPhone} style={{
                  fontSize: 12, color: 'var(--cyan)', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>＋ Add Phone</button>
              </div>
              {form.phones.map((ph, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8 }}>
                    <input className="form-input"
                      placeholder="+1 234 567 890"
                      value={ph.phoneNumber}
                      onChange={e => updatePhone(i, 'phoneNumber', e.target.value)}
                      style={inputErr(`phone_${i}`)} />
                    <select className="form-input"
                      style={{
                        appearance: 'none', width: 100,
                        background: LABEL_COLORS[ph.label]?.bg,
                        color: LABEL_COLORS[ph.label]?.color,
                      }}
                      value={ph.label}
                      onChange={e => updatePhone(i, 'label', e.target.value)}>
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                      <option value="home">Home</option>
                      <option value="mobile">Mobile</option>
                    </select>
                    {form.phones.length > 1 && (
                      <button onClick={() => removePhone(i)} style={{
                        width: 36, borderRadius: 8,
                        background: 'rgba(255,0,153,0.1)',
                        border: '1px solid rgba(255,0,153,0.2)',
                        color: 'var(--pink)', cursor: 'pointer',
                      }}>✕</button>
                    )}
                  </div>
                  {errors[`phone_${i}`] && (
                    <div style={{ color: 'var(--pink)', fontSize: 11, marginTop: 4 }}>
                      ⚠ {errors[`phone_${i}`]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: 14, borderRadius: 12,
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                color: 'var(--muted)', cursor: 'pointer',
                fontFamily: "'Syne',sans-serif", fontWeight: 600,
              }}>Cancel</button>
              <motion.button onClick={handleSubmit} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: 2, padding: 14, borderRadius: 12,
                  background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
                  color: 'var(--indigo)', border: 'none', cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? 'Saving...' : 'Save Contact →'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}