import { useEffect, useRef } from 'react'
import { useStore } from '../../state/store'
import { glSupported, registerPlanet, setPlanetAnimation, type PlanetParams } from './glPlanet'

interface Props { params: PlanetParams; size: number }

// Ring planets draw into a larger square so the ring is not clipped; the sphere stays `size` wide.
export function Planet({ params, size }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useStore((s) => s.reducedMotion)
  const useGl = glSupported()
  const box = params.ring ? Math.round(size * 1.95) : size

  useEffect(() => {
    if (!useGl || !ref.current) return
    return registerPlanet(ref.current, params, box)
  }, [useGl, params, box])
  useEffect(() => { if (useGl) setPlanetAnimation(!reduced) }, [useGl, reduced])

  return (
    <span className="p-inner" style={{ display: 'block', position: 'relative', width: size, height: size }} aria-hidden="true">
      {useGl ? (
        <canvas ref={ref} style={{ width: box, height: box, maxWidth: 'none', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
      ) : (
        <span className="css-planet" style={{ width: size, height: size, display: 'block', boxShadow: params.ring ? '0 0 0 1px #333' : undefined }} />
      )}
    </span>
  )
}
