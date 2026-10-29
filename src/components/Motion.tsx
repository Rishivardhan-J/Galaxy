import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { useStore } from '../state/store'

const easeOut = [0.22, 1, 0.36, 1] as const

export const screenVariants = (reduced: boolean): Variants =>
  reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.1 } }, exit: { opacity: 0, transition: { duration: 0.1 } } }
    : {
        hidden: (d: number) => ({ opacity: 0, y: 10 * d }),
        show: { opacity: 1, y: 0, transition: { duration: 0.16, ease: easeOut, staggerChildren: 0.025 } },
        exit: (d: number) => ({ opacity: 0, y: -10 * d, transition: { duration: 0.1, ease: easeOut } }),
      }

export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useStore((s) => s.reducedMotion)
  const direction = useStore((s) => s.direction)
  return (
    <motion.section
      className={`screen ${className}`}
      custom={direction}
      variants={screenVariants(reduced)}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {children}
    </motion.section>
  )
}

const itemV: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } } }
const itemR: Variants = { hidden: { opacity: 0 }, show: { opacity: 1 } }

export function Item({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' }) {
  const reduced = useStore((s) => s.reducedMotion)
  const C = as === 'li' ? motion.li : motion.div
  return <C className={className} variants={reduced ? itemR : itemV}>{children}</C>
}
