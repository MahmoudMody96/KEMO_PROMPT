import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Apply the persisted theme before React mounts.
//
// This used to live in Sidebar's effect, which only mounts after sign-in and
// never on /admin — so the login and admin screens had no data-theme at all and
// fell back to the light-mode :root variables while their own CSS painted a dark
// surface. Doing it here also removes the light-to-dark flash on every load.
document.documentElement.setAttribute(
  'data-theme',
  localStorage.getItem('kemo-theme') || 'dark'
)

// ErrorBoundary only catches errors thrown during render. Almost every failure
// in this app is asynchronous — generation, search, extraction, admin fetches —
// so a rejection that escapes a catch used to vanish silently. At minimum it
// should reach the console with a clear marker.
window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandled rejection]', event.reason)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
