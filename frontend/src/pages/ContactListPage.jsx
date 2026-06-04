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
  const { type } = useParams()    // work | personal | home | favourites | recent
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

      // filter based on type
      if (type === 'favourites') {
        all = all.filter(c => favourites.includes(c.id))
      } else if (type === 'recent') {
        all = [...all].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
      } else {
        // filter by label in emails or phones
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
    LABEL_STYLE[label] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--muted)', border: 'rgba(255,255,255,0.15)' }

  return (
    <div style={{ paddingTop: 100, padding: '100px 24px 60px', position: 'relative', zIndex: 2 }}>

      {/* EDIT & DELETE MODALS */}
      <EditContactModal
        open={!!editContact} contact={editContact}
        onClose={() => setEditContact(null)}
        onUpdated={(updated) => {
          fetchContacts()
          toast.success('Contact updated ✓')
        }}
      />
      <DeleteContactModal
        open={!!deleteContact} contact={deleteContact}
        onClose={() => setDeleteContact(null)}
        onDeleted={() => { fetchContacts(); toast.success('Contact deleted') }}
      />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* PAGE HEADER */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'none', border: 'none', color: 'var(--muted)',
            cursor: 'pointer', fontSize: 14, marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>← Back to Dashboard</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, fontSize: 26,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `rgba(${meta.color === 'var(--cyan)' ? '0,229,255' : meta.color === 'var(--pink)' ? '255,0,153' : '255,215,0'},0.1)`,
              boxShadow: `0 0 20px ${meta.glow}`,
            }}>{meta.icon}</div>
            <div>
              <h1 style={{
                fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800,
                letterSpacing: -1,
                background: `linear-gradient(135deg,${meta.color},var(--white))`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{meta.label}</h1>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>

        {/* SEARCH */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', marginBottom: 24 }}>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>⌕</span>
          <input
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}
            placeholder={`Search ${meta.label.toLowerCase()}...`}
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
          )}
        </motion.div>

        {/* CONTACT CARDS */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card" style={{ height: 200, opacity: 0.4 }} />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card"
            style={{ padding: 80, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{meta.icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              No {meta.label.toLowerCase()} found
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>
              {type === 'favourites'
                ? 'Star contacts from the dashboard to see them here'
                : `Contacts with a "${type}" label will appear here`}
            </div>
          </motion.div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
              <AnimatePresence>
                {contacts.map((c, i) => {
                  const isFav = favourites.includes(c.id)
                  // get the relevant emails and phones for this view
                  const relevantEmails = type === 'favourites' || type === 'recent'
                    ? c.emails : c.emails?.filter(e => e.label === type)
                  const relevantPhones = type === 'favourites' || type === 'recent'
                    ? c.phones : c.phones?.filter(p => p.label === type)

                  return (
                    <motion.div key={c.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -5, boxShadow: `0 12px 40px rgba(0,0,0,0.35),0 0 0 1px ${meta.glow}` }}
                      className="glass-card"
                      style={{ padding: 22, position: 'relative' }}>

                      {/* FAVOURITE STAR */}
                      <button onClick={() => toggleFavourite(c.id)} style={{
                        position: 'absolute', top: 14, right: 14,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 18, lineHeight: 1,
                        color: isFav ? '#ff6600' : 'var(--muted)',
                        transition: 'all 0.2s',
                        filter: isFav ? 'drop-shadow(0 0 6px #ff6600)' : 'none',
                      }}>★</button>

                      {/* AVATAR */}
                      <div style={{
                        width: 50, height: 50, borderRadius: 14,
                        background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18,
                        marginBottom: 12,
                      }}>
                        {getInitials(c.firstName, c.lastName)}
                      </div>

                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 2, paddingRight: 24 }}>
                        {c.firstName} {c.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{c.title || '—'}</div>

                      {/* EMAILS */}
                      {(relevantEmails?.length > 0 || c.emails?.length > 0) && (
                        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 12, marginBottom: 8 }}>
                          {(relevantEmails?.length ? relevantEmails : c.emails)?.map((em, ei) => {
                            const ls = getLabelStyle(em.label)
                            return (
                              <div key={ei} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>✉</span>
                                <span style={{ flex: 1, fontSize: 12, color: 'var(--muted)',
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {em.emailAddress}
                                </span>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                                  background: ls.bg, color: ls.color,
                                  border: `1px solid ${ls.border}`,
                                }}>{em.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* PHONES */}
                      {(relevantPhones?.length > 0 || c.phones?.length > 0) && (
                        <div style={{ marginBottom: 14 }}>
                          {(relevantPhones?.length ? relevantPhones : c.phones)?.map((ph, pi) => {
                            const ls = getLabelStyle(ph.label)
                            return (
                              <div key={pi} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: 'var(--muted)' }}>📞</span>
                                <span style={{ flex: 1, fontSize: 12, color: 'var(--muted)' }}>{ph.phoneNumber}</span>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
                                  background: ls.bg, color: ls.color,
                                  border: `1px solid ${ls.border}`,
                                }}>{ph.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button onClick={() => setEditContact(c)}
                          style={{
                            flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12,
                            background: 'rgba(0,229,255,0.08)',
                            border: '1px solid rgba(0,229,255,0.15)',
                            color: 'var(--cyan)', cursor: 'pointer',
                            fontWeight: 500, transition: 'all 0.2s',
                          }}>✏ Edit</button>
                        <button onClick={() => setDeleteContact(c)}
                          style={{
                            flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12,
                            background: 'rgba(255,0,153,0.08)',
                            border: '1px solid rgba(255,0,153,0.15)',
                            color: 'var(--pink)', cursor: 'pointer',
                            fontWeight: 500, transition: 'all 0.2s',
                          }}>✕ Delete</button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  style={{ width: 36, height: 36, borderRadius: 8,
                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                    color: page === 0 ? 'var(--muted)' : 'var(--white)', cursor: 'pointer' }}>‹</button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    style={{ width: 36, height: 36, borderRadius: 8,
                      background: page === i ? 'rgba(0,229,255,0.15)' : 'var(--glass)',
                      border: page === i ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--glass-border)',
                      color: page === i ? 'var(--cyan)' : 'var(--muted)',
                      fontWeight: page === i ? 600 : 400, cursor: 'pointer' }}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  style={{ width: 36, height: 36, borderRadius: 8,
                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                    color: 'var(--white)', cursor: 'pointer' }}>›</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

