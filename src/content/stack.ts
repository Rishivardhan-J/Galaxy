export type StackGroup = 'Interface' | 'Services' | 'Data' | 'Infra'
export const STACK_GROUPS: StackGroup[] = ['Interface', 'Services', 'Data', 'Infra']

export const stackGroup: Record<string, StackGroup> = {
  React: 'Interface', TypeScript: 'Interface', Flutter: 'Interface', Dart: 'Interface',
  FastAPI: 'Services', 'Node.js': 'Services', Python: 'Services',
  PostgreSQL: 'Data', Neo4j: 'Data', MongoDB: 'Data',
  Docker: 'Infra', Render: 'Infra', Supabase: 'Infra', 'Neo4j Aura': 'Infra',
}

export const groupStack = (stack: string[]) =>
  STACK_GROUPS.map((g) => ({ group: g, items: stack.filter((t) => stackGroup[t] === g) })).filter((g) => g.items.length)
