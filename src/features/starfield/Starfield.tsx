import { useEffect, useRef } from 'react'
import { createStarfield } from './engine'

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => createStarfield(ref.current!), [])
  return (
    <canvas ref={ref} className="starfield" aria-hidden="true" />
  )
}
