import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import NoiseBackground from './components/NoiseBackground.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'

function parseRoute() {
  if (typeof window === 'undefined') return '/'
  const hash = window.location.hash.replace(/^#/, '') || '/'
  // strip nested fragment (#/#programs) — return only path part
  const path = hash.split('#')[0] || '/'
  return path === '' ? '/' : path
}

export default function App() {
  const [route, setRoute] = useState(parseRoute)

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute())
    window.addEventListener('hashchange', onHashChange)
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
