// Subsequence match with a bonus for contiguous and word-start hits. Returns -1 when no match.
export function fuzzy(query: string, text: string): number {
  const q = query.toLowerCase().replace(/\s+/g, ''), t = text.toLowerCase()
  if (!q) return 0
  let ti = 0, score = 0, streak = 0
  for (const ch of q) {
    const at = t.indexOf(ch, ti)
    if (at < 0) return -1
    streak = at === ti ? streak + 1 : 0
    score += 1 + streak * 2 + (at === 0 || t[at - 1] === ' ' ? 3 : 0) - (at - ti) * 0.1
    ti = at + 1
  }
  return score
}
