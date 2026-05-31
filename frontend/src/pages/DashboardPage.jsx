// import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
// import api from '../api/axios'
// import AddContactModal from '../components/modals/AddContactModal'
// import DeleteContactModal from '../components/modals/DeleteContactModal'
// import ChangePasswordModal from '../components/modals/ChangePasswordModal'
// import { toast } from 'react-toastify'

// const AVATAR_GRADIENTS = [
//   'linear-gradient(135deg,#00e5ff,#0088ff)',
//   'linear-gradient(135deg,#ff0099,#7700ff)',
//   'linear-gradient(135deg,#ffd700,#ff6600)',
//   'linear-gradient(135deg,#00ff88,#00e5ff)',
//   'linear-gradient(135deg,#7700ff,#ff0099)',
// ]

// export default function DashboardPage() {
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const [contacts, setContacts] = useState([])
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(0)
//   const [totalPages, setTotalPages] = useState(1)
//   const [loading, setLoading] = useState(true)
//   const [showAdd, setShowAdd] = useState(false)
//   const [showDelete, setShowDelete] = useState(false)
//   const [showPassword, setShowPassword] = useState(false)
//   const [selectedContact, setSelectedContact] = useState(null)
//   const [activeTab, setActiveTab] = useState('all')

//   const fetchContacts = async () => {
//     setLoading(true)
//     try {
//       const res = await api.get('/contacts', {
//         params: { page, size: 9, search: search || undefined }
//       })
//       setContacts(res.data.data.content)
//       setTotalPages(res.data.data.totalPages)
//     } catch (err) {
//       toast.error('Failed to load contacts')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchContacts() }, [page, search])

//   const handleLogout = () => { logout(); navigate('/login') }

//   const getInitials = (first, last) =>
//     `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()

//   return (
//     <div style={{ paddingTop: 100, padding: '100px 24px 60px', position: 'relative', zIndex: 2 }}>

//       {/* MODALS */}
//       <AddContactModal open={showAdd} onClose={() => setShowAdd(false)}
//         onAdded={() => { fetchContacts(); toast.success('Contact added ✓') }} />
//       <DeleteContactModal open={showDelete} onClose={() => setShowDelete(false)}
//         contact={selectedContact}
//         onDeleted={() => { fetchContacts(); toast.success('Contact deleted') }} />
//       <ChangePasswordModal open={showPassword} onClose={() => setShowPassword(false)} />

//       <div style={{ maxWidth: 1200, margin: '0 auto' }}>

//         {/* DASH HEADER */}
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
//           className="glass-card"
//           style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             padding: '18px 28px', marginBottom: 20 }}>
//           <div style={{
//             fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18,
//             background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
//             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//           }}>⬡ NEXUS</div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ padding: '6px 14px', borderRadius: 100,
//               background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)',
//               fontSize: 12, color: 'var(--cyan)' }}>⬤ Live</div>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ textAlign: 'right' }}>
//               <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.username}</div>
//               <div style={{ fontSize: 11, color: 'var(--muted)' }}>Personal Plan</div>
//             </div>
//             <div style={{
//               width: 38, height: 38, borderRadius: '50%',
//               background: 'linear-gradient(135deg,var(--pink),#7700ff)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
//             }}>
//               {user?.username?.[0]?.toUpperCase()}
//             </div>
//           </div>
//         </motion.div>

//         {/* SEARCH */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="glass-card"
//           style={{ display: 'flex', alignItems: 'center', gap: 12,
//             padding: '14px 20px', marginBottom: 20 }}>
//           <span style={{ color: 'var(--muted)', fontSize: 18 }}>⌕</span>
//           <input
//             style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
//               color: 'var(--white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}
//             placeholder="Search contacts by name..."
//             value={search}
//             onChange={e => { setSearch(e.target.value); setPage(0) }}
//           />
//           {search && (
//             <button onClick={() => setSearch('')}
//               style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 18 }}>
//               ✕
//             </button>
//           )}
//         </motion.div>

//         {/* MAIN GRID */}
//         <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>

//           {/* SIDEBAR */}
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.15 }}
//             className="glass-card"
//             style={{ padding: 24, height: 'fit-content' }}>

//             {[
//               { label: 'Navigation', items: [
//                 { icon: '◎', text: 'All Contacts', key: 'all' },
//                 { icon: '★', text: 'Favourites', key: 'fav' },
//                 { icon: '⊕', text: 'Recent', key: 'recent' },
//               ]},
//               { label: 'Account', items: [
//                 { icon: '🔒', text: 'Change Password', action: () => setShowPassword(true) },
//                 { icon: '↩', text: 'Logout', action: handleLogout },
//               ]},
//             ].map((section, si) => (
//               <div key={si} style={{ marginBottom: 28 }}>
//                 <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
//                   color: 'var(--muted)', marginBottom: 12, fontWeight: 600 }}>
//                   {section.label}
//                 </div>
//                 {section.items.map((item, ii) => (
//                   <div key={ii}
//                     onClick={item.action || (() => item.key && setActiveTab(item.key))}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: 12,
//                       padding: '10px 12px', borderRadius: 10, fontSize: 14,
//                       color: activeTab === item.key ? 'var(--cyan)' : 'var(--muted)',
//                       background: activeTab === item.key ? 'rgba(0,229,255,0.08)' : 'transparent',
//                       border: activeTab === item.key ? '1px solid rgba(0,229,255,0.15)' : '1px solid transparent',
//                       cursor: 'pointer', marginBottom: 4,
//                       transition: 'all 0.2s',
//                     }}>
//                     <span>{item.icon}</span>{item.text}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </motion.div>

//           {/* CONTACTS */}
//           <div>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//               <div style={{ fontSize: 14, color: 'var(--muted)' }}>
//                 Showing <span style={{ color: 'var(--white)', fontWeight: 600 }}>{contacts.length}</span> contacts
//               </div>
//               <motion.button onClick={() => setShowAdd(true)}
//                 whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,0,153,0.5)' }}
//                 whileTap={{ scale: 0.97 }}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 8,
//                   padding: '10px 20px', borderRadius: 10,
//                   background: 'linear-gradient(135deg,var(--pink),#7700ff)',
//                   color: 'white', fontSize: 14, fontWeight: 600,
//                   border: 'none', cursor: 'pointer',
//                   boxShadow: '0 0 20px rgba(255,0,153,0.3)',
//                 }}>
//                 ＋ Add Contact
//               </motion.button>
//             </div>

//             {loading ? (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
//                 {[...Array(6)].map((_, i) => (
//                   <div key={i} className="glass-card" style={{ padding: 20, height: 180,
//                     animation: 'pulse 1.5s ease-in-out infinite' }} />
//                 ))}
//               </div>
//             ) : contacts.length === 0 ? (
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="glass-card"
//                 style={{ padding: 60, textAlign: 'center' }}>
//                 <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
//                 <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
//                   No contacts yet
//                 </div>
//                 <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
//                   {search ? `No results for "${search}"` : 'Add your first contact to get started'}
//                 </div>
//                 <button onClick={() => setShowAdd(true)}
//                   style={{ padding: '12px 28px', borderRadius: 100,
//                     background: 'linear-gradient(135deg,var(--pink),#7700ff)',
//                     color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
//                   ＋ Add Contact
//                 </button>
//               </motion.div>
//             ) : (
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
//                 <AnimatePresence>
//                   {contacts.map((c, i) => (
//                     <motion.div key={c.id}
//                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, scale: 0.9 }}
//                       transition={{ delay: i * 0.05 }}
//                       whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.3),0 0 0 1px rgba(0,229,255,0.1)' }}
//                       className="glass-card"
//                       style={{ padding: 20, cursor: 'pointer' }}>

//                       <div style={{
//                         width: 48, height: 48, borderRadius: 14,
//                         background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18,
//                         marginBottom: 12,
//                       }}>
//                         {getInitials(c.firstName, c.lastName)}
//                       </div>

//                       <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
//                         {c.firstName} {c.lastName}
//                       </div>
//                       <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>{c.title || '—'}</div>

//                       <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
//                         {c.emails?.[0] && (
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
//                             <span>✉</span>
//                             <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                               {c.emails[0].emailAddress}
//                             </span>
//                             <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 600,
//                               background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)' }}>
//                               {c.emails[0].label}
//                             </span>
//                           </div>
//                         )}
//                         {c.phones?.[0] && (
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
//                             <span>📞</span>{c.phones[0].phoneNumber}
//                           </div>
//                         )}
//                       </div>

//                       <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
//                         <button onClick={() => { setSelectedContact(c); setShowDelete(true) }}
//                           style={{ flex: 1, padding: 7, borderRadius: 8,
//                             background: 'rgba(255,0,153,0.08)', border: '1px solid rgba(255,0,153,0.15)',
//                             color: 'var(--pink)', fontSize: 12, cursor: 'pointer',
//                             transition: 'all 0.2s' }}>
//                           ✕ Delete
//                         </button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//               </div>
//             )}

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
//                 <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
//                   style={{ width: 36, height: 36, borderRadius: 8,
//                     background: 'var(--glass)', border: '1px solid var(--glass-border)',
//                     color: page === 0 ? 'var(--muted)' : 'var(--white)', cursor: 'pointer' }}>‹</button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button key={i} onClick={() => setPage(i)}
//                     style={{ width: 36, height: 36, borderRadius: 8,
//                       background: page === i ? 'rgba(0,229,255,0.15)' : 'var(--glass)',
//                       border: page === i ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--glass-border)',
//                       color: page === i ? 'var(--cyan)' : 'var(--muted)',
//                       fontWeight: page === i ? 600 : 400, cursor: 'pointer' }}>
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
//                   style={{ width: 36, height: 36, borderRadius: 8,
//                     background: 'var(--glass)', border: '1px solid var(--glass-border)',
//                     color: page === totalPages - 1 ? 'var(--muted)' : 'var(--white)', cursor: 'pointer' }}>›</button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

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
          }}>⬡ NEXUS</div>
          <div style={{ padding: '6px 14px', borderRadius: 100,
            background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)',
            fontSize: 12, color: 'var(--cyan)' }}>⬤ Live</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Personal Plan</div>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--pink),#7700ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14,
            }}>{user?.username?.[0]?.toUpperCase()}</div>
          </div>
        </motion.div>

        {/* SEARCH */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 20px', marginBottom: 20 }}>
          <span style={{ color: 'var(--muted)', fontSize: 18 }}>⌕</span>
          <input
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--white)', fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}
            placeholder="Search all contacts by name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
          )}
        </motion.div>

        {/* GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20 }}>

          {/* SIDEBAR */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card" style={{ padding: 24, height: 'fit-content' }}>

            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Views</div>

            {sidebarNav.map((item, i) => (
              <div key={i}
                onClick={item.action || undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, fontSize: 14,
                  color: !item.action ? 'var(--cyan)' : 'var(--muted)',
                  background: !item.action ? 'rgba(0,229,255,0.08)' : 'transparent',
                  border: !item.action ? '1px solid rgba(0,229,255,0.15)' : '1px solid transparent',
                  cursor: item.action ? 'pointer' : 'default',
                  marginBottom: 4, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (item.action) e.currentTarget.style.color = 'var(--white)' }}
                onMouseLeave={e => { if (item.action) e.currentTarget.style.color = 'var(--muted)' }}>
                <span>{item.icon}</span>{item.text}
              </div>
            ))}

            <div style={{ height: 1, background: 'var(--glass-border)', margin: '16px 0' }} />

            <div style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 10, fontWeight: 600 }}>Account</div>

            {[
              { icon: '🔒', text: 'Change Password', action: () => setShowPassword(true) },
              { icon: '↩', text: 'Logout', action: handleLogout },
            ].map((item, i) => (
              <div key={i} onClick={item.action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, fontSize: 14,
                  color: 'var(--muted)', cursor: 'pointer', marginBottom: 4,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                <span>{item.icon}</span>{item.text}
              </div>
            ))}
          </motion.div>

          {/* CONTACTS */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                Showing <span style={{ color: 'var(--white)', fontWeight: 600 }}>{contacts.length}</span> contacts
              </div>
              <motion.button onClick={() => setShowAdd(true)}
                whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(255,0,153,0.5)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg,var(--pink),#7700ff)',
                  color: 'white', fontSize: 14, fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(255,0,153,0.3)',
                }}>＋ Add Contact</motion.button>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card" style={{ height: 200, opacity: 0.3 }} />
                ))}
              </div>
            ) : contacts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                  {search ? `No results for "${search}"` : 'No contacts yet'}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
                  {!search && 'Add your first contact to get started'}
                </div>
                {!search && (
                  <button onClick={() => setShowAdd(true)} style={{
                    padding: '12px 28px', borderRadius: 100,
                    background: 'linear-gradient(135deg,var(--pink),#7700ff)',
                    color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                  }}>＋ Add Contact</button>
                )}
              </motion.div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                <AnimatePresence>
                  {contacts.map((c, i) => {
                    const isFav = favourites.includes(c.id)
                    return (
                      <motion.div key={c.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.3),0 0 0 1px rgba(0,229,255,0.1)' }}
                        className="glass-card" style={{ padding: 20, position: 'relative' }}>

                        {/* STAR */}
                        <button onClick={() => toggleFavourite(c.id)} style={{
                          position: 'absolute', top: 12, right: 12,
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 16, color: isFav ? '#ff6600' : 'var(--muted)',
                          filter: isFav ? 'drop-shadow(0 0 5px #ff6600)' : 'none',
                          transition: 'all 0.2s',
                        }}>★</button>

                        {/* AVATAR */}
                        <div style={{
                          width: 46, height: 46, borderRadius: 13,
                          background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16,
                          marginBottom: 10,
                        }}>{getInitials(c.firstName, c.lastName)}</div>

                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 600,
                          fontSize: 14, marginBottom: 2, paddingRight: 22 }}>
                          {c.firstName} {c.lastName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                          {c.title || '—'}
                        </div>

                        {/* EMAILS */}
                        {c.emails?.length > 0 && (
                          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 10, marginBottom: 6 }}>
                            {c.emails.map((em, ei) => {
                              const ls = getLabelStyle(em.label)
                              return (
                                <div key={ei} style={{ display: 'flex', alignItems: 'center',
                                  gap: 6, marginBottom: 5, fontSize: 11 }}>
                                  <span style={{ color: 'var(--muted)' }}>✉</span>
                                  <span style={{ flex: 1, color: 'var(--muted)', overflow: 'hidden',
                                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {em.emailAddress}
                                  </span>
                                  <span style={{
                                    padding: '1px 7px', borderRadius: 100, fontSize: 9, fontWeight: 700,
                                    background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`,
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                  }}>{em.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* PHONES */}
                        {c.phones?.length > 0 && (
                          <div style={{ marginBottom: 12 }}>
                            {c.phones.map((ph, pi) => {
                              const ls = getLabelStyle(ph.label)
                              return (
                                <div key={pi} style={{ display: 'flex', alignItems: 'center',
                                  gap: 6, marginBottom: 4, fontSize: 11 }}>
                                  <span style={{ color: 'var(--muted)' }}>📞</span>
                                  <span style={{ flex: 1, color: 'var(--muted)' }}>{ph.phoneNumber}</span>
                                  <span style={{
                                    padding: '1px 7px', borderRadius: 100, fontSize: 9, fontWeight: 700,
                                    background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`,
                                    textTransform: 'uppercase', letterSpacing: '0.5px',
                                  }}>{ph.label}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* ACTIONS */}
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setEditContact(c)} style={{
                            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11,
                            background: 'rgba(0,229,255,0.08)',
                            border: '1px solid rgba(0,229,255,0.15)',
                            color: 'var(--cyan)', cursor: 'pointer', fontWeight: 500,
                          }}>✏ Edit</button>
                          <button onClick={() => setDeleteContact(c)} style={{
                            flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 11,
                            background: 'rgba(255,0,153,0.08)',
                            border: '1px solid rgba(255,0,153,0.15)',
                            color: 'var(--pink)', cursor: 'pointer', fontWeight: 500,
                          }}>✕ Delete</button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  style={{ width: 36, height: 36, borderRadius: 8,
                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                    color: 'var(--white)', cursor: 'pointer' }}>‹</button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)} style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: page === i ? 'rgba(0,229,255,0.15)' : 'var(--glass)',
                    border: page === i ? '1px solid rgba(0,229,255,0.3)' : '1px solid var(--glass-border)',
                    color: page === i ? 'var(--cyan)' : 'var(--muted)',
                    fontWeight: page === i ? 600 : 400, cursor: 'pointer',
                  }}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  style={{ width: 36, height: 36, borderRadius: 8,
                    background: 'var(--glass)', border: '1px solid var(--glass-border)',
                    color: 'var(--white)', cursor: 'pointer' }}>›</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}