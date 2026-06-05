import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'
import {
  validateName,
  validateContactEmail,
  validateContactPhone,
} from '../../utils/validators'

import PropTypes from 'prop-types'

export default function EditContactModal({ open, onClose, contact, onUpdated }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', title: '',
    emails: [{ emailAddress: '', label: 'work' }],
    phones: [{ phoneNumber: '', label: 'work' }],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // pre-populate form when contact changes
  useEffect(() => {
    if (contact) {
      setForm({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        title: contact.title || '',
        emails: contact.emails?.length
          ? contact.emails.map(e => ({ emailAddress: e.emailAddress, label: e.label }))
          : [{ emailAddress: '', label: 'work' }],
        phones: contact.phones?.length
          ? contact.phones.map(p => ({ phoneNumber: p.phoneNumber, label: p.label }))
          : [{ phoneNumber: '', label: 'work' }],
      })
    }
  }, [contact])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const updateEmail = (index, field, value) => {
    const updated = [...form.emails]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, emails: updated })
  }

  const updatePhone = (index, field, value) => {
    const updated = [...form.phones]
    updated[index] = { ...updated[index], [field]: value }
    setForm({ ...form, phones: updated })
  }

  const addEmail = () =>
    setForm({ ...form, emails: [...form.emails, { emailAddress: '', label: 'work' }] })

  const addPhone = () =>
    setForm({ ...form, phones: [...form.phones, { phoneNumber: '', label: 'work' }] })

  const removeEmail = i =>
    setForm({ ...form, emails: form.emails.filter((_, idx) => idx !== i) })

  const removePhone = i =>
    setForm({ ...form, phones: form.phones.filter((_, idx) => idx !== i) })

  const handleSubmit = async () => {
    const e = {}

    const firstErr = validateName(form.firstName, 'First name')
    if (firstErr) e.firstName = firstErr

    const lastErr = validateName(form.lastName, 'Last name')
    if (lastErr) e.lastName = lastErr

    if (form.title && form.title.trim() && /[0-9]/.test(form.title))
      e.title = 'Title cannot contain numbers'

    form.emails.forEach((em, i) => {
      const err = validateContactEmail(em.emailAddress)
      if (err) e[`email_${i}`] = err
    })

    form.phones.forEach((ph, i) => {
      const err = validateContactPhone(ph.phoneNumber)
      if (err) e[`phone_${i}`] = err
    })

    if (Object.keys(e).length > 0) {
      setError(Object.values(e)[0])
      return
    }

    setLoading(true)
    setError('')
    try {
      await api.put(`/contacts/${contact.id}`, form)
      onUpdated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { marginBottom: 12 }
  const labelColors = {
    work: { bg: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' },
    personal: { bg: 'rgba(255,0,153,0.1)', color: 'var(--pink)' },
    home: { bg: 'rgba(255,215,0,0.1)', color: 'var(--gold)' },
    mobile: { bg: 'rgba(119,0,255,0.1)', color: '#aa44ff' },
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
          <motion.div
            initial={{ y: 24, scale: 0.96 }} animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={e => e.stopPropagation()}
            className="glass-card"
            style={{
              width: '100%', maxWidth: 540, padding: 40,
              position: 'relative', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5),0 0 40px rgba(0,229,255,0.15)',
            }}>

            {/* top glow line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)',
              borderRadius: '20px 20px 0 0',
            }} />

            <button onClick={onClose} style={{
              position: 'absolute', top: 16, right: 16, width: 32, height: 32,
              borderRadius: '50%', background: 'var(--glass)',
              border: '1px solid var(--glass-border)', color: 'var(--muted)',
              cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              ✏ Edit Contact
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
              Update contact details below
            </p>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                background: 'rgba(255,0,153,0.1)', border: '1px solid rgba(255,0,153,0.3)',
                color: 'var(--pink)', fontSize: 13,
              }}>{error}</div>
            )}

            {/* NAME ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="form-label" htmlFor="edit-firstName">First Name</label>
                <input
                  id="edit-firstName"
                  className="form-input"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="edit-lastName">Last Name</label>
                <input
                  id="edit-lastName"
                  className="form-input"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* TITLE */}
            <div style={inputStyle}>
              <label className="form-label" htmlFor="edit-title">Title / Role</label>
              <input
                id="edit-title"
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Senior Manager"
              />
            </div>

            {/* EMAILS */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" htmlFor="edit-email-0" style={{ margin: 0 }}>Email Addresses</label>
                <button onClick={addEmail} style={{
                  fontSize: 12, color: 'var(--cyan)', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>＋ Add Email</button>
              </div>
              {form.emails.map((em, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, marginBottom: 8 }}>
                  <input
                    id={`edit-email-${i}`}
                    className="form-input"
                    type="email"
                    placeholder="email@example.com"
                    value={em.emailAddress}
                    onChange={e => updateEmail(i, 'emailAddress', e.target.value)}
                  />
                  <select className="form-input" style={{ appearance: 'none', width: 100,
                    background: labelColors[em.label]?.bg || 'rgba(255,255,255,0.05)',
                    color: labelColors[em.label]?.color || 'var(--white)' }}
                    value={em.label}
                    onChange={e => updateEmail(i, 'label', e.target.value)}>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="home">Home</option>
                  </select>
                  {form.emails.length > 1 && (
                    <button onClick={() => removeEmail(i)} style={{
                      width: 36, borderRadius: 8, background: 'rgba(255,0,153,0.1)',
                      border: '1px solid rgba(255,0,153,0.2)', color: 'var(--pink)',
                      cursor: 'pointer', fontSize: 14,
                    }}>✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* PHONES */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="form-label" htmlFor="edit-phone-0" style={{ margin: 0 }}>Phone Numbers</label>
                <button onClick={addPhone} style={{
                  fontSize: 12, color: 'var(--cyan)', background: 'none',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                }}>＋ Add Phone</button>
              </div>
              {form.phones.map((ph, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8, marginBottom: 8 }}>
                  <input
                    id={`edit-phone-${i}`}
                    className="form-input"
                    placeholder="+1 234 567 890"
                    value={ph.phoneNumber}
                    onChange={e => updatePhone(i, 'phoneNumber', e.target.value)}
                  />
                  <select className="form-input" style={{ appearance: 'none', width: 100,
                    background: labelColors[ph.label]?.bg || 'rgba(255,255,255,0.05)',
                    color: labelColors[ph.label]?.color || 'var(--white)' }}
                    value={ph.label}
                    onChange={e => updatePhone(i, 'label', e.target.value)}>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="home">Home</option>
                    <option value="mobile">Mobile</option>
                  </select>
                  {form.phones.length > 1 && (
                    <button onClick={() => removePhone(i)} style={{
                      width: 36, borderRadius: 8, background: 'rgba(255,0,153,0.1)',
                      border: '1px solid rgba(255,0,153,0.2)', color: 'var(--pink)',
                      cursor: 'pointer', fontSize: 14,
                    }}>✕</button>
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
                fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 15,
              }}>Cancel</button>
              <motion.button onClick={handleSubmit} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: 2, padding: 14, borderRadius: 12,
                  background: 'linear-gradient(135deg,var(--cyan),#0088ff)',
                  color: 'var(--indigo)', border: 'none', cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15,
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? 'Saving...' : 'Save Changes →'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

EditContactModal.propTypes = {
  open:      PropTypes.bool.isRequired,
  onClose:   PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
  contact:   PropTypes.shape({
    id:        PropTypes.number,
    firstName: PropTypes.string,
    lastName:  PropTypes.string,
    title:     PropTypes.string,
    emails:    PropTypes.arrayOf(PropTypes.shape({
      emailAddress: PropTypes.string,
      label:        PropTypes.string,
    })),
    phones:    PropTypes.arrayOf(PropTypes.shape({
      phoneNumber: PropTypes.string,
      label:       PropTypes.string,
    })),
  }),
}

EditContactModal.defaultProps = {
  contact: null,
}