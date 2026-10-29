import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import './styles/tokens.css'
import './styles/globals.css'
import App from './app/App'
import { useStore } from './state/store'

if (import.meta.env.DEV) (window as unknown as { __store: typeof useStore }).__store = useStore // devtools / debugging only
document.documentElement.classList.add('js')
document.getElementById('seo')?.remove()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
