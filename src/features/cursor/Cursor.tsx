import { useEffect, useRef, useState } from 'react'
import { useMotionValue, useSpring, motion } from 'motion/react'

export default function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 })
  const [big, setBig] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY)
      setBig(!!(e.target as HTMLElement).closest?.('a,button,[role="button"],input'))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])
  return <motion.div ref={ref} className={`cursor ${big ? 'big' : ''}`} style={{ x: sx, y: sy }} aria-hidden="true" />
}
