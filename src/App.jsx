import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import NoiseBackground from './components/NoiseBackground.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'

// Hash schema:
//   #/                  → Landing
//   #/dashboard         → Dashboard
//   #/#programs         → Landing, then scroll to element id="programs"
//   #/#dashboard        → still Landing (since #dashboard is the section, but no element id=dashboard on landing)
function parseHash() {
  if (typeof window === 'undefined') return { route: '/', section: '' }
  const raw = window.location.hash.replace(/^#/, '')
  const [pathRaw, section = ''] = raw.split('#')
  const path = pathRaw === '' ? '/' : (pathRaw.startsWith('/') ? pathRaw : '/' + pathRaw)
  return { route: path, section }
}

function scrollToSection(id, attempt = 0) {
  if (!id) return
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  // The page may not have mounted yet — retry a few times.
  if (attempt < 10) {
    setTimeout(() => scrollToSection(id, attempt + 1), 80)
  }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash().route)

  useEffect(() => {
    const onHashChange = () => {
      const { route: r, section } = parseHash()
      setRoute(r)
      scrollToSection(section)
    }
    window.addEventListener('hashchange', onHashChange)
    // Initial load may already have a section in the URL
    scrollToSection(parseHash().section)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      <NoiseBackground />
      <Nav route={route} />
      {route === '/dashboard' ? <Dashboard key="dash" /> : <Landing key="landing" />}
    </>
  )
}
