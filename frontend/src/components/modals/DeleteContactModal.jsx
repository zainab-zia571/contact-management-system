import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axios'

export default function DeleteContactModal({ open, onClose, contact, onDeleted }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await api.delete(`/contacts/${contact.id}`)
      onDeleted()
      onClose()
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
            style={{ width: '90%', maxWidth: 420, padding: 40, position: 'relative',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(255,0,153,0.2)' }}>

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,var(--pink),transparent)',
              borderRadius: '20px 20px 0 0' }} />

            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(255,0,153,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, marginBottom: 20,
            }}>🗑</div>

            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Delete contact?
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--white)' }}>{contact?.firstName} {contact?.lastName}</strong> will be permanently removed. This cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: 14, borderRadius: 12,
                background: 'var(--glass)', border: '1px solid var(--glass-border)',
                color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Syne',sans-serif", fontWeight: 600,
              }}>Cancel</button>
              <motion.button onClick={handleDelete} disabled={loading}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1, padding: 14, borderRadius: 12,
                  background: 'linear-gradient(135deg,var(--pink),#7700ff)',
                  color: 'white', border: 'none', cursor: 'pointer',
                  fontFamily: "'Syne',sans-serif", fontWeight: 700,
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}