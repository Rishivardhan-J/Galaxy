import type { Project } from '../../content/projects'

type D = NonNullable<Project['diagram']>
const H = 44

export function Diagram({ diagram, label }: { diagram: D; label: string }) {
  const by = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]))
  return (
    <svg className="diagram" viewBox="0 0 660 290" role="img" aria-label={label}>
      <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#8a8a8a" /></marker></defs>
      {diagram.edges.map(([a, b], i) => {
        const A = by[a], B = by[b]
        const ax = A.x + A.w, ay = A.y + H / 2
        const horizontal = B.x >= A.x + A.w - 1
        const x1 = horizontal ? ax : A.x + A.w / 2, y1 = horizontal ? ay : B.y > A.y ? A.y + H : A.y
        const x2 = horizontal ? B.x : B.x + B.w / 2, y2 = horizontal ? B.y + H / 2 : B.y > A.y ? B.y : B.y + H
        const mx = (x1 + x2) / 2
        return <path key={i} className="edge" pathLength={1} markerEnd="url(#arr)" d={horizontal ? `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}` : `M${x1} ${y1} L${x2} ${y2}`} />
      })}
      {diagram.nodes.map((n, i) => (
        <g key={n.id} className="node" style={{ animationDelay: `${i * 90}ms` }}>
          <rect x={n.x} y={n.y} width={n.w} height={H} rx={H / 2} />
          <text x={n.x + n.w / 2} y={n.y + H / 2 + 4} textAnchor="middle">{n.label}</text>
        </g>
      ))}
    </svg>
  )
}
