import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '../api/axios'
import EditContactModal from '../components/modals/EditContactModal'
import DeleteContactModal from '../components/modals/DeleteContactModal'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#00e5ff,#0088ff)',
  'linear-gradient(135deg,#ff0099,#7700ff)',
  'linear-gradient(135deg,#ffd700,#ff6600)',
  'linear-gradient(135deg,#00ff88,#00e5ff)',
  'linear-gradient(135deg,#7700ff,#ff0099)',
]

const PAGE_META = {
  work:     { label: 'Work Contacts',     icon: '💼', color: 'var(--cyan)',  glow: 'rgba(0,229,255,0.2)'  },
  personal: { label: 'Personal Contacts', icon: '👤', color: 'var(--pink)',  glow: 'rgba(255,0,153,0.2)'  },
  home:     { label: 'Home Contacts',     icon: '🏠', color: 'var(--gold)',  glow: 'rgba(255,215,0,0.2)'  },
  favourites:{ label: 'Favourites',       icon: '★',  color: '#ff6600',     glow: 'rgba(255,102,0,0.2)'  },
  recent:   { label: 'Recent Contacts',   icon: '🕐', color: '#00ff88',     glow: 'rgba(0,255,136,0.2)'  },
}

const LABEL_STYLE = {
  work:     { bg: 'rgba(0,229,255,0.12)',  color: 'var(--cyan)',  border: 'rgba(0,229,255,0.25)'  },
  personal: { bg: 'rgba(255,0,153,0.12)', color: 'var(--pink)',  border: 'rgba(255,0,153,0.25)'  },
  home:     { bg: 'rgba(255,215,0,0.12)', color: 'var(--gold)',  border: 'rgba(255,215,0,0.25)'  },
  mobile:   { bg: 'rgba(119,0,255,0.12)', color: '#aa44ff',      border: 'rgba(119,0,255,0.25)'  },
}

export default function ContactListPage() {
  const { type } = useParams()
  const navigate = useNavigate()
  const meta = PAGE_META[type] || PAGE_META.work

  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexus_favourites') || '[]') }
    catch { return [] }
  })

  const [editContact, setEditContact] = useState(null)
  const [deleteContact, setDeleteContact] = useState(null)

  const saveFavourites = (ids) => {
    setFavourites(ids)
    localStorage.setItem('nexus_favourites', JSON.stringify(ids))
  }

  const toggleFavourite = (id) => {
    const updated = favourites.includes(id)
      ? favourites.filter(f => f !== id)
      : [...favourites, id]
    saveFavourites(updated)
    toast.success(favourites.includes(id) ? 'Removed from favourites' : 'Added to favourites ★')
  }

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/contacts', {
        params: { page, size: 50, search: search || undefined }
      })

      let all = res.data.data.content
      setTotalPages(res.data.data.totalPages)

      if (type === 'favourites') {
        all = all.filter(c => favourites.includes(c.id))
      } else if (type === 'recent') {
        all = [...all].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 10)
      } else {
        all = all.filter(c =>
          c.emails?.some(e => e.label === type) ||
          c.phones?.some(p => p.label === type)
        )
      }

      setContacts(all)
    } catch {
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(0)
    setSearch('')
  }, [type])

  useEffect(() => { fetchContacts() }, [page, search, type, favourites.length])

  const getInitials = (first, last) =>
    `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()

  const getLabelStyle = (label) =>
    LABEL_STYLE[label] || {
      bg: 'rgba(255,255,255,0.08)',
      color: 'var(--muted)',
      border: 'rgba(255,255,255,0.15)'
    }

  return (
    <div style={{ paddingTop: 100, padding: '100px 24px 60px', position: 'relative', zIndex: 2 }}>

      <EditContactModal
        open={!!editContact}
        contact={editContact}
        onClose={() => setEditContact(null)}
        onUpdated={() => { fetchContacts(); toast.success('Contact updated ✓') }}
      />

      <DeleteContactModal
        open={!!deleteContact}
        contact={deleteContact}
        onClose={() => setDeleteContact(null)}
        onDeleted={() => { fetchContacts(); toast.success('Contact deleted') }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}>

          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            cursor: 'pointer', fontSize: 14, marginBottom: 16,
          }}>← Back to Dashboard</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: meta.color === 'var(--cyan)'
                ? 'rgba(0,229,255,0.1)'
                : meta.color === 'var(--pink)'
                ? 'rgba(255,0,153,0.1)'
                : 'rgba(255,215,0,0.1)',
              boxShadow: `0 0 20px ${meta.glow}`,
              fontSize: 26,
            }}>
              {meta.icon}
            </div>

            <div>
              <h1 style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 32,
                fontWeight: 800,
                background: `linear-gradient(135deg,${meta.color},var(--white))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{meta.label}</h1>

              <p style={{ color: 'var(--muted)', fontSize: 14 }}>
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            <AnimatePresence>
              {contacts.map((c, i) => {
                const isFav = favourites.includes(c.id)

                return (
                  <motion.div
                    key={c.id}
                    className="glass-card"
                    style={{ padding: 22, position: 'relative' }}
                  >

                    {/* STAR */}
                    <button onClick={() => toggleFavourite(c.id)}>
                      ★
                    </button>

                    {/* NAME */}
                    <div style={{ fontWeight: 700 }}>
                      {c.firstName} {c.lastName}
                    </div>

                    {/* ACTIONS (UPDATED) */}
                    <div style={{ display: 'flex', gap: 6 }}>

                      {/* 👁 VIEW BUTTON ADDED */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/contact/${c.id}`)
                        }}
                        style={{
                          flex: 2,
                          padding: '7px 0',
                          borderRadius: 8,
                          fontSize: 12,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--white)',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        👁 View
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditContact(c)
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 0',
                          borderRadius: 8,
                          fontSize: 12,
                          background: 'rgba(0,229,255,0.08)',
                          border: '1px solid rgba(0,229,255,0.15)',
                          color: 'var(--cyan)',
                          cursor: 'pointer',
                        }}
                      >
                        ✏
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteContact(c)
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 0',
                          borderRadius: 8,
                          fontSize: 12,
                          background: 'rgba(255,0,153,0.08)',
                          border: '1px solid rgba(255,0,153,0.15)',
                          color: 'var(--pink)',
                          cursor: 'pointer',
                        }}
                      >
                        🗑
                      </button>

                    </div>

                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}