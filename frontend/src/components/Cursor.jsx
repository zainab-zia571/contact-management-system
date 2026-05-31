import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let mx = 0, my = 0

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px'
        cursorRef.current.style.top = my + 'px'
      }
    }

    const animate = () => {
      ring.current.x += (mx - ring.current.x) * 0.12
      ring.current.y += (my - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    animate()
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={cursorRef} style={{
        position: 'fixed', width: 12, height: 12,
        background: 'var(--cyan)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        transition: 'transform 0.1s, background 0.2s',
        mixBlendMode: 'screen',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36,
        border: '1.5px solid rgba(0,229,255,0.5)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
        transition: 'all 0.15s ease',
      }} />
    </>
  )
}