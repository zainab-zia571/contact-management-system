import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' }
  })
}

function StatCounter({ target, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let current = 0
    const step = target / 60
    const timer = setInterval(() => {
      current += step
      if (current >= target) { current = target; clearInterval(timer) }
      if (ref.current) ref.current.textContent = Math.floor(current).toLocaleString() + suffix
    }, 20)
    return () => clearInterval(timer)
  }, [inView, target, suffix])

  return (
    <span ref={ref} style={{
      fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800,
      background: 'linear-gradient(135deg,var(--cyan),var(--white))',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      display: 'block',
    }}>0</span>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    { icon: '🔐', title: 'JWT Auth', color: 'cyan', desc: 'Secure token-based authentication with Spring Security.' },
    { icon: '⚡', title: 'Lightning Search', color: 'pink', desc: 'Instant search across thousands of contacts with zero lag.' },
    { icon: '📋', title: 'Smart Profiles', color: 'gold', desc: 'Multiple emails and phones with labels. All organized.' },
  ]

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>
      {/* GLOW ORBS */}
      {[
        { color: 'var(--cyan)', top: '-100px', left: '-100px', delay: '0s' },
        { color: 'var(--pink)', bottom: '-100px', right: '-100px', delay: '-4s' },
        { color: '#7700ff', top: '40%', left: '60%', delay: '-2s' },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'fixed', width: i === 0 ? 500 : i === 1 ? 400 : 300,
          height: i === 0 ? 500 : i === 1 ? 400 : 300,
          borderRadius: '50%', background: orb.color,
          filter: 'blur(80px)', opacity: 0.12,
          top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right,
          pointerEvents: 'none', zIndex: 0,
          animation: `orbFloat 8s ease-in-out infinite`,
          animationDelay: orb.delay,
        }} />
      ))}

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative',
      }}>
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            border: '1px solid rgba(0,229,255,0.3)',
            background: 'rgba(0,229,255,0.05)',
            fontSize: 12, fontWeight: 500, color: 'var(--cyan)',
            letterSpacing: '1.5px', textTransform: 'uppercase',
            marginBottom: 32,
          }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          Contact Management Reimagined
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 'clamp(52px,8vw,100px)',
            fontWeight: 800, lineHeight: 0.95,
            letterSpacing: -3, marginBottom: 28,
          }}>
          <span style={{ display: 'block', color: 'var(--white)' }}>Manage your</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg,var(--cyan) 0%,var(--pink) 60%,var(--gold) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 200%',
            animation: 'gradShift 4s ease-in-out infinite',
          }}>connections</span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
          style={{
            maxWidth: 520, fontSize: 18, lineHeight: 1.7,
            color: 'var(--muted)', fontWeight: 300, marginBottom: 48,
          }}>
          A next-generation contact platform built for professionals who demand more. Beautiful, fast, and effortlessly organized.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} style={{
            padding: '16px 40px', borderRadius: 100,
            background: 'linear-gradient(135deg,var(--pink),#7700ff)',
            color: 'white', fontWeight: 600, fontSize: 16,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 0 40px rgba(255,0,153,0.4)',
            transition: 'all 0.3s',
          }}>
            Start for free →
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '16px 40px', borderRadius: 100,
            background: 'transparent', color: 'var(--white)',
            fontWeight: 500, fontSize: 16,
            border: '1px solid var(--glass-border)', cursor: 'pointer',
            backdropFilter: 'blur(10px)', transition: 'all 0.3s',
          }}>
            Sign in
          </button>
        </motion.div>

        {/* STATS */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 64, marginTop: 80 }}>
          {[
            { count: 12400, suffix: '+', label: 'Active users' },
            { count: 99, suffix: '%', label: 'Uptime' },
            { count: 4800, suffix: '+', label: 'Contacts synced' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <StatCounter target={s.count} suffix={s.suffix} />
              <div style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.5px', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px 120px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 16 }}>
            Why Nexus
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, letterSpacing: -2 }}>
            Everything you{' '}
            <span style={{ background: 'linear-gradient(135deg,var(--gold),var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>need</span>
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 1000, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="glass-card"
              style={{ padding: 32 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, fontSize: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: f.color === 'cyan' ? 'rgba(0,229,255,0.1)' : f.color === 'pink' ? 'rgba(255,0,153,0.1)' : 'rgba(255,215,0,0.1)',
                marginBottom: 20,
              }}>{f.icon}</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1);} 50%{transform:translate(30px,-30px) scale(1.05);} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.8);} }
      `}</style>
    </div>
  )
}