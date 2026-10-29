// Injects static, crawlable markup (src/seo.tsx) into dist/index.html. main.tsx removes it once JS runs.
import { createServer } from 'vite'
import { readFile, writeFile } from 'node:fs/promises'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { SeoShell } = await server.ssrLoadModule('/src/seo.tsx')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { createElement } = await import('react')
  const html = renderToStaticMarkup(createElement(SeoShell))
  const file = 'dist/index.html'
  const page = await readFile(file, 'utf8')
  if (!page.includes('<!--seo-->')) throw new Error('seo marker missing in dist/index.html')
  await writeFile(file, page.replace('<!--seo-->', html))
  console.log('prerender: injected', html.length, 'bytes')
} finally {
  await server.close()
}
