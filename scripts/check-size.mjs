// Fails the build if the entry JS exceeds the 200 KB gzip budget from the PRD.
import { readdir, readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const html = await readFile('dist/index.html', 'utf8')
const entry = html.match(/src="\/assets\/(index-[^"]+\.js)"/)?.[1]
const preload = [...html.matchAll(/modulepreload"[^>]*href="\/assets\/([^"]+\.js)"/g)].map((m) => m[1])
let total = 0
for (const f of [entry, ...preload].filter(Boolean)) total += gzipSync(await readFile(`dist/assets/${f}`)).length
const kb = total / 1024
const lazy = (await readdir('dist/assets')).filter((f) => f.endsWith('.js')).length - 1 - preload.length
console.log(`initial JS: ${kb.toFixed(1)} KB gzip (budget 200), ${lazy} lazy chunk(s)`)
if (kb > 200) { console.error('Initial JS budget exceeded'); process.exit(1) }
