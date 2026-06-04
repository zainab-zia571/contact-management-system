

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' }
  })
}

const features = [
  { icon: '🔐', title: 'Secure by Default', color: 'cyan',
    desc: 'JWT-based authentication with Spring Security. Every request is verified and encrypted.' },
  { icon: '⚡', title: 'Instant Search', color: 'pink',
    desc: 'Filter thousands of contacts by name in real time. Paginated and blazing fast.' },
  { icon: '📋', title: 'Smart Labels', color: 'gold',
    desc: 'Tag emails and phones as Work, Personal, or Home. Filter your contacts by label.' },
  { icon: '★', title: 'Favourites', color: 'orange',
    desc: 'Star your most important contacts and access them instantly from a dedicated view.' },
  { icon: '✏', title: 'Easy Editing', color: 'cyan',
    desc: 'Update any contact detail in seconds. Add multiple emails and phones per contact.' },
  { icon: '🗑', title: 'Clean Deletes', color: 'pink',
    desc: 'Delete contacts safely with a confirmation step. No accidental removals.' },
]

const steps = [
  { num: '01', title: 'Create an account', desc: 'Register with your email or phone number in seconds.' },
  { num: '02', title: 'Add your contacts', desc: 'Create contacts with names, emails, phones and labels.' },
  { num: '03', title: 'Organize everything', desc: 'Filter by Work, Personal, Home or mark as Favourite.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  const colorMap = {
    cyan:   { grad: 'linear-gradient(135deg,var(--cyan),#0088ff)',   bg: 'rgba(0,229,255,0.08)'  },
    pink:   { grad: 'linear-gradient(135deg,var(--pink),#7700ff)',   bg: 'rgba(255,0,153,0.08)'  },
    gold:   { grad: 'linear-gradient(135deg,var(--gold),#ff6600)',   bg: 'rgba(255,215,0,0.08)'  },
    orange: { grad: 'linear-gradient(135deg,#ff6600,var(--pink))',   bg: 'rgba(255,102,0,0.08)'  },
  }

  return (
    <div style={{ position: 'relative', zIndex: 2 }}>

      {/* GLOW ORBS */}
      {[
        { c: 'var(--cyan)',  t: '-120px', l: '-120px', delay: '0s',  size: 480 },
        { c: 'var(--pink)',  b: '-120px', r: '-120px', delay: '-4s', size: 400 },
        { c: '#7700ff',      t: '45%',   l: '58%',    delay: '-2s', size: 300 },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'fixed', width: o.size, height: o.size,
          borderRadius: '50%', background: o.c, filter: 'blur(90px)',
          opacity: 0.12, top: o.t, left: o.l, bottom: o.b, right: o.r,
          pointerEvents: 'none', zIndex: 0,
          animation: 'orbFloat 9s ease-in-out infinite',
          animationDelay: o.delay,
        }} />
      ))}

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '140px 24px 80px',
      }}>
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 18px', borderRadius: 100,
            border: '1px solid rgba(0,229,255,0.3)',
            background: 'rgba(0,229,255,0.06)',
            fontSize: 12, fontWeight: 600, color: 'var(--cyan)',
            letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 36,
          }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%',
            background: 'var(--cyan)', display: 'inline-block',
            animation: 'pulse 2s infinite' }} />
          Your contacts. Reimagined.
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: 'clamp(48px,8vw,96px)',
            fontWeight: 800, lineHeight: 0.93,
            letterSpacing: '-3px', marginBottom: 32,
          }}>
          <span style={{ display: 'block', color: 'var(--white)' }}>The smarter way</span>
          <span style={{ display: 'block', color: 'var(--white)' }}>to manage</span>
          <span style={{
            display: 'block',
            background: 'linear-gradient(135deg,var(--cyan) 0%,var(--pink) 55%,var(--gold) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundSize: '200%',
            animation: 'gradShift 5s ease-in-out infinite',
          }}>your network.</span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
          style={{
            maxWidth: 500, fontSize: 17, lineHeight: 1.75,
            color: 'var(--muted)', fontWeight: 300, marginBottom: 52,
          }}>
          Touchbase is a beautiful, fast contact manager built with Spring Boot and React.
          Organize contacts by label, mark favourites, and find anyone instantly.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button onClick={() => navigate('/register')}
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255,0,153,0.55)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '16px 44px', borderRadius: 100,
              background: 'linear-gradient(135deg,var(--pink),#7700ff)',
              color: 'white', fontWeight: 700, fontSize: 16,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 0 36px rgba(255,0,153,0.35)',
              fontFamily: "'Syne',sans-serif",
            }}>
            Get started free →
          </motion.button>
          <motion.button onClick={() => navigate('/login')}
            whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '16px 44px', borderRadius: 100,
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--white)', fontWeight: 500, fontSize: 16,
              border: '1px solid var(--glass-border)', cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}>
            Sign in
          </motion.button>
        </motion.div>

        {/* STATS ROW */}
        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 56, marginTop: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { num: '4 Views',    label: 'Work · Personal · Home · Favourites' },
            { num: 'JWT Auth',   label: 'Secure login & registration'          },
            { num: 'Real-time',  label: 'Instant search & pagination'          },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800,
                background: 'linear-gradient(135deg,var(--cyan),var(--white))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, letterSpacing: '0.3px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
              color: 'var(--cyan)', marginBottom: 14, fontWeight: 600 }}>How it works</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(30px,4vw,48px)',
              fontWeight: 800, letterSpacing: -1.5 }}>
              Up and running in{' '}
              <span style={{ background: 'linear-gradient(135deg,var(--cyan),var(--pink))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                3 steps
              </span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                whileHover={{ y: -5 }}
                className="glass-card" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  fontFamily: "'Syne',sans-serif", fontSize: 56, fontWeight: 800,
                  color: 'rgba(255,255,255,0.04)', position: 'absolute', top: 12, right: 20,
                  lineHeight: 1,
                }}>{s.num}</div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, marginBottom: 20,
                  background: i === 0
                    ? 'linear-gradient(135deg,var(--cyan),#0088ff)'
                    : i === 1
                    ? 'linear-gradient(135deg,var(--pink),#7700ff)'
                    : 'linear-gradient(135deg,var(--gold),#ff6600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15,
                  color: i === 0 ? 'var(--indigo)' : 'white',
                }}>{parseInt(s.num)}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '40px 24px 100px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase',
              color: 'var(--pink)', marginBottom: 14, fontWeight: 600 }}>Features</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(30px,4vw,48px)',
              fontWeight: 800, letterSpacing: -1.5 }}>
              Everything you{' '}
              <span style={{ background: 'linear-gradient(135deg,var(--gold),var(--pink))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>need</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
            {features.map((f, i) => {
              const cm = colorMap[f.color] || colorMap.cyan
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="glass-card" style={{ padding: 28 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 13, fontSize: 22,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: cm.bg, marginBottom: 18,
                  }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17,
                    fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{f.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 24px 120px' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: 700, margin: '0 auto', textAlign: 'center',
            padding: '60px 40px',
            background: 'linear-gradient(135deg,rgba(0,229,255,0.06),rgba(255,0,153,0.06))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 28, position: 'relative', overflow: 'hidden',
          }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent)',
          }} />
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,4vw,40px)',
            fontWeight: 800, letterSpacing: -1, marginBottom: 16 }}>
            Ready to get organized?
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Create your free account and start managing contacts beautifully.
          </p>
          <motion.button onClick={() => navigate('/register')}
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(255,0,153,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '16px 48px', borderRadius: 100,
              background: 'linear-gradient(135deg,var(--pink),#7700ff)',
              color: 'white', fontWeight: 700, fontSize: 16,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Syne',sans-serif",
              boxShadow: '0 0 36px rgba(255,0,153,0.3)',
            }}>
            Create free account →
          </motion.button>
        </motion.div>
      </section>

      <style>{`
        @keyframes orbFloat { 0%,100%{transform:translate(0,0);} 50%{transform:translate(28px,-28px);} }
        @keyframes gradShift { 0%,100%{background-position:0%;} 50%{background-position:100%;} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.75);} }
      `}</style>
    </div>
  )
}