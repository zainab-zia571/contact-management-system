import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import api from '../api/axios'
import EditContactModal from '../components/modals/EditContactModal'
import DeleteContactModal from '../components/modals/DeleteContactModal'
import PropTypes from 'prop-types'

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

const InfoRow = ({ icon, label, value, labelStyle }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px', borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      marginBottom: 10,
    }}>
    <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '1px',
        textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, color: 'var(--white)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
    {labelStyle && (
      <span style={{
        padding: '3px 10px', borderRadius: 100, fontSize: 10,
        fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
        background: labelStyle.bg, color: labelStyle.color,
        border: `1px solid ${labelStyle.border}`, flexShrink: 0,
      }}>{label.split(' ')[0]}</span>
    )}
  </motion.div>
)

InfoRow.propTypes = {
  icon:       PropTypes.string.isRequired,
  label:      PropTypes.string.isRequired,
  value:      PropTypes.string.isRequired,
  labelStyle: PropTypes.shape({
    bg:     PropTypes.string,
    color:  PropTypes.string,
    border: PropTypes.string,
  }),
}

InfoRow.defaultProps = { labelStyle: null }

export default function ContactDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isFav, setIsFav] = useState(false)

  const avatarGrad = AVATAR_GRADIENTS[Number(id) % AVATAR_GRADIENTS.length]

  const fetchContact = async () => {
    try {
      const res = await api.get(`/contacts/${id}`)
      setContact(res.data.data)
    } catch {
      toast.error('Failed to load contact')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContact()
    const favs = JSON.parse(
      sessionStorage.getItem('nexus_favourites') || '[]')
    setIsFav(favs.includes(Number(id)))
  }, [id])

  const toggleFav = () => {
    const favs = JSON.parse(
      sessionStorage.getItem('nexus_favourites') || '[]')
    const updated = isFav
      ? favs.filter(f => f !== Number(id))
      : [...favs, Number(id)]
    sessionStorage.setItem('nexus_favourites', JSON.stringify(updated))
    setIsFav(!isFav)
    toast.success(isFav ? 'Removed from favourites' : 'Added to favourites ★')
  }

  const getInitials = (first, last) =>
    `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 2,
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            border: '2px solid rgba(0,229,255,0.2)',
            borderTopColor: 'var(--cyan)',
          }} />
      </div>
    )
  }

  if (!contact) return null

  return (
    <div style={{
      minHeight: '100vh', padding: '100px 24px 60px',
      position: 'relative', zIndex: 2,
    }}>
      <EditContactModal
        open={showEdit} contact={contact}
        onClose={() => setShowEdit(false)}
        onUpdated={() => {
          fetchContact()
          toast.success('Contact updated ✓')
        }}
      />
      <DeleteContactModal
        open={showDelete} contact={contact}
        onClose={() => setShowDelete(false)}
        onDeleted={() => {
          toast.success('Contact deleted')
          navigate('/dashboard')
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* BACK */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--muted)', cursor: 'pointer',
            fontSize: 14, marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
          ← Back
        </motion.button>

        {/* HERO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card"
          style={{
            padding: '40px 40px 32px',
            marginBottom: 20, position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}>

          {/* GLOW TOP LINE */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg,transparent,var(--cyan),transparent)`,
          }} />

          {/* BACKGROUND AVATAR WATERMARK */}
          <div style={{
            position: 'absolute', right: -20, top: -20,
            width: 200, height: 200, borderRadius: '50%',
            background: avatarGrad, filter: 'blur(60px)',
            opacity: 0.08, pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex', alignItems: 'flex-start',
            gap: 28, flexWrap: 'wrap',
          }}>
            {/* AVATAR */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{
                width: 96, height: 96, borderRadius: 28,
                background: avatarGrad, flexShrink: 0,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800, fontSize: 34,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}>
              {getInitials(contact.firstName, contact.lastName)}
            </motion.div>

            {/* NAME + TITLE */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 'clamp(24px,4vw,40px)',
                  fontWeight: 800, letterSpacing: -1,
                  marginBottom: 6, lineHeight: 1.1,
                }}>
                {contact.firstName}{' '}
                <span style={{
                  background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {contact.lastName}
                </span>
              </motion.h1>

              {contact.title && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    fontSize: 15, color: 'var(--muted)',
                    marginBottom: 16,
                  }}>
                  {contact.title}
                </motion.div>
              )}

              {/* TAGS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {contact.emails?.map((e, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 100, fontSize: 11,
                    fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: LABEL_STYLE[e.label]?.bg || 'rgba(255,255,255,0.08)',
                    color: LABEL_STYLE[e.label]?.color || 'var(--muted)',
                    border: `1px solid ${LABEL_STYLE[e.label]?.border || 'rgba(255,255,255,0.1)'}`,
                  }}>✉ {e.label}</span>
                ))}
                {contact.phones?.map((p, i) => (
                  <span key={i} style={{
                    padding: '4px 12px', borderRadius: 100, fontSize: 11,
                    fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: LABEL_STYLE[p.label]?.bg || 'rgba(255,255,255,0.08)',
                    color: LABEL_STYLE[p.label]?.color || 'var(--muted)',
                    border: `1px solid ${LABEL_STYLE[p.label]?.border || 'rgba(255,255,255,0.1)'}`,
                  }}>📞 {p.label}</span>
                ))}
              </motion.div>
            </div>

            {/* ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex', gap: 8,
                flexShrink: 0, alignItems: 'flex-start',
              }}>
              {/* FAVOURITE */}
              <button onClick={toggleFav} style={{
                width: 40, height: 40, borderRadius: 10,
                background: isFav
                  ? 'rgba(255,102,0,0.15)'
                  : 'rgba(255,255,255,0.05)',
                border: isFav
                  ? '1px solid rgba(255,102,0,0.3)'
                  : '1px solid var(--glass-border)',
                color: isFav ? '#ff6600' : 'var(--muted)',
                fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                filter: isFav ? 'drop-shadow(0 0 6px #ff6600)' : 'none',
                transition: 'all 0.2s',
              }}>★</button>

              {/* EDIT */}
              <motion.button
                onClick={() => setShowEdit(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 18px', borderRadius: 10,
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.2)',
                  color: 'var(--cyan)', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                ✏ Edit
              </motion.button>

              {/* DELETE */}
              <motion.button
                onClick={() => setShowDelete(true)}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{
                  padding: '10px 18px', borderRadius: 10,
                  background: 'rgba(255,0,153,0.08)',
                  border: '1px solid rgba(255,0,153,0.2)',
                  color: 'var(--pink)', cursor: 'pointer',
                  fontSize: 14, fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                🗑 Delete
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* DETAILS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: 20,
        }}>

          {/* EMAILS */}
          {contact.emails?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
              style={{ padding: 28 }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                fontSize: 16, marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(0,229,255,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14,
                }}>✉</span>
                Email Addresses
              </div>
              {contact.emails.map((em, i) => (
                <InfoRow
                  key={i}
                  icon="✉"
                  label={`${em.label} email`}
                  value={em.emailAddress}
                  labelStyle={LABEL_STYLE[em.label]}
                />
              ))}
            </motion.div>
          )}

          {/* PHONES */}
          {contact.phones?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card"
              style={{ padding: 28 }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 700,
                fontSize: 16, marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(255,0,153,0.1)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14,
                }}>📞</span>
                Phone Numbers
              </div>
              {contact.phones.map((ph, i) => (
                <InfoRow
                  key={i}
                  icon="📞"
                  label={`${ph.label} phone`}
                  value={ph.phoneNumber}
                  labelStyle={LABEL_STYLE[ph.label]}
                />
              ))}
            </motion.div>
          )}

          {/* METADATA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card"
            style={{ padding: 28 }}>
            <div style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 700,
              fontSize: 16, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(255,215,0,0.1)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14,
              }}>📋</span>
              Details
            </div>
            {contact.title && (
              <InfoRow icon="💼" label="Title" value={contact.title} />
            )}
            <InfoRow
              icon="📅"
              label="Added on"
              value={formatDate(contact.createdAt)}
            />
            <InfoRow
              icon="🔄"
              label="Last updated"
              value={formatDate(contact.updatedAt)}
            />
            <InfoRow
              icon="★"
              label="Favourite"
              value={isFav ? 'Yes — in your favourites' : 'No'}
            />
          </motion.div>

          {/* QUICK ACTIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="glass-card"
            style={{ padding: 28 }}>
            <div style={{
              fontFamily: "'Syne',sans-serif", fontWeight: 700,
              fontSize: 16, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'rgba(119,0,255,0.1)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14,
              }}>⚡</span>
              Quick Actions
            </div>

            {contact.emails?.[0] && (
              <a href={`mailto:${contact.emails[0].emailAddress}`}
                style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 10, marginBottom: 10,
                    background: 'rgba(0,229,255,0.05)',
                    border: '1px solid rgba(0,229,255,0.15)',
                    color: 'var(--cyan)', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  <span>✉</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      Send Email
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {contact.emails[0].emailAddress}
                    </div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>
                </motion.div>
              </a>
            )}

            {contact.phones?.[0] && (
              <a href={`tel:${contact.phones[0].phoneNumber}`}
                style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 10, marginBottom: 10,
                    background: 'rgba(255,0,153,0.05)',
                    border: '1px solid rgba(255,0,153,0.15)',
                    color: 'var(--pink)', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                  <span>📞</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      Call
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {contact.phones[0].phoneNumber}
                    </div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>
                </motion.div>
              </a>
            )}

            <motion.div
              whileHover={{ x: 4 }}
              onClick={toggleFav}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10,
                background: isFav
                  ? 'rgba(255,102,0,0.05)'
                  : 'rgba(255,255,255,0.03)',
                border: isFav
                  ? '1px solid rgba(255,102,0,0.15)'
                  : '1px solid var(--glass-border)',
                color: isFav ? '#ff6600' : 'var(--muted)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
              <span>★</span>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {isFav ? 'Remove from Favourites' : 'Add to Favourites'}
              </div>
              <span style={{ marginLeft: 'auto', fontSize: 12 }}>→</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}