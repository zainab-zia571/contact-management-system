import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import AddContactModal from '../components/modals/AddContactModal'
import EditContactModal from '../components/modals/EditContactModal'
import DeleteContactModal from '../components/modals/DeleteContactModal'
import ChangePasswordModal from '../components/modals/ChangePasswordModal'
import { toast } from 'react-toastify'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#00e5ff,#0088ff)',
  'linear-gradient(135deg,#ff0099,#7700ff)',
  'linear-gradient(135deg,#ffd700,#ff6600)',
  'linear-gradient(135deg,#00ff88,#00e5ff)',
  'linear-gradient(135deg,#7700ff,#ff0099)',
]

const LABEL_STYLE = {
  work:     { bg: 'rgba(0,229,255,0.12)',  color: 'var(--cyan)',  border: 'rgba(0,229,255,0.25)'  },
  personal: { bg: 'rgba(255,0,153,0.12)', color: 'var(--pink)',  border: 'rgba(255,0,153,0.25)'  },
  home:     { bg: 'rgba(255,215,0,0.12)', color: 'var(--gold)',  border: 'rgba(255,215,0,0.25)'  },
  mobile:   { bg: 'rgba(119,0,255,0.12)', color: '#aa44ff',      border: 'rgba(119,0,255,0.25)'  },
}

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editContact, setEditContact] = useState(null)
  const [deleteContact, setDeleteContact] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexus_favourites') || '[]') }
    catch { return [] }
  })

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
        params: { page, size: 9, search: search || undefined }
      })
      setContacts(res.data.data.content)
      setTotalPages(res.data.data.totalPages)
    } catch {
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContacts() }, [page, search])

  const handleLogout = () => { logout(); navigate('/login') }

  const getInitials = (first, last) =>
    `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()

  const getLabelStyle = (label) =>
    LABEL_STYLE[label] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--muted)', border: 'rgba(255,255,255,0.15)' }

  const sidebarNav = [
    { icon: '◎', text: 'All Contacts',      action: null,                      key: 'all'  },
    { icon: '★', text: 'Favourites',         action: () => navigate('/contacts/favourites'), key: 'fav'  },
    { icon: '🕐', text: 'Recent',             action: () => navigate('/contacts/recent'),     key: 'rec'  },
    { icon: '💼', text: 'Work',               action: () => navigate('/contacts/work'),       key: 'wrk'  },
    { icon: '👤', text: 'Personal',           action: () => navigate('/contacts/personal'),   key: 'per'  },
    { icon: '🏠', text: 'Home',               action: () => navigate('/contacts/home'),       key: 'hom'  },
  ]

  return (
    <div style={{ padding: '100px 24px 60px', position: 'relative', zIndex: 2 }}>

      <AddContactModal open={showAdd} onClose={() => setShowAdd(false)}
        onAdded={() => { fetchContacts(); toast.success('Contact added ✓') }} />

      <EditContactModal open={!!editContact} contact={editContact}
        onClose={() => setEditContact(null)}
        onUpdated={() => { fetchContacts(); toast.success('Contact updated ✓') }} />

      <DeleteContactModal open={!!deleteContact} contact={deleteContact}
        onClose={() => setDeleteContact(null)}
        onDeleted={() => { fetchContacts(); toast.success('Contact deleted') }} />

      <ChangePasswordModal open={showPassword} onClose={() => setShowPassword(false)} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 28px', marginBottom: 20 }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18,
            background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>◎ TouchBase</div>

          <div style={{ padding: '6px 14px', borderRadius: 100,
            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)',
            fontSize: 12, color: 'var(--cyan)' }}>⬤ Live</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Personal Plan</div>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

          {/* SIDEBAR */}
          <motion.div className="glass-card" style={{ padding: 24, height: 'fit-content' }}>

            {sidebarNav.map((item) => (
              item.action ? (
                <button key={item.key} onClick={item.action}
                  style={{ width: '100%', marginBottom: 4 }}>
                  {item.icon} {item.text}
                </button>
              ) : (
                <div key={item.key}>{item.icon} {item.text}</div>
              )
            ))}

          </motion.div>

          {/* CONTACTS */}
          <div>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                <AnimatePresence>
                  {contacts.map((c, i) => {
                    const isFav = favourites.includes(c.id)

                    return (
                      <motion.div
                        key={c.id}
                        className="glass-card"
                        style={{ padding: 20, position: 'relative', cursor: 'pointer' }}

                        // ✅ CLICKABLE CARD
                        onClick={() => navigate(`/contact/${c.id}`)}
                        whileHover={{ y: -4 }}
                      >

                        {/* STAR */}
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavourite(c.id) }}
                        >
                          ★
                        </button>

                        {/* NAME */}
                        <div>{c.firstName} {c.lastName}</div>

                        {/* ACTIONS (UPDATED) */}
                        <div style={{ display: 'flex', gap: 6 }}>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/contact/${c.id}`)
                            }}
                            style={{
                              flex: 2,
                              padding: '6px 0',
                              borderRadius: 8,
                              fontSize: 11,
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'var(--white)',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
                            👁 View
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditContact(c)
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 0',
                              borderRadius: 8,
                              fontSize: 11,
                              background: 'rgba(0,229,255,0.08)',
                              border: '1px solid rgba(0,229,255,0.15)',
                              color: 'var(--cyan)',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
                            ✏
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteContact(c)
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 0',
                              borderRadius: 8,
                              fontSize: 11,
                              background: 'rgba(255,0,153,0.08)',
                              border: '1px solid rgba(255,0,153,0.15)',
                              color: 'var(--pink)',
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
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
      </div>
    </div>
  )
}