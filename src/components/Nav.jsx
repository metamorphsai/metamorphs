import { useEffect, useState } from 'react'

const GITHUB_URL = 'https://github.com/metamorphsai/metamorphs'
const TELEGRAM_URL = 'https://t.me/metamorphsai'
const X_URL = 'https://x.com/metamorphs_ai'

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.6-1.3-1.6-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.9 1.2 3.1 0 4.3-2.7 5.3-5.2 5.6.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z"/>
    </svg>
  )
}

function IconTelegram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.6 8.2-1.9 8.9c-.1.6-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3 5.6-5.1c.2-.2 0-.3-.3-.1l-7 4.4-3-.9c-.6-.2-.7-.6.1-.9l11.7-4.5c.5-.2 1-.1.7 1.2z"/>
    </svg>
  )
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.4 8.46L23 22h-6.92l-5.41-7.07L4.41 22H1.15l7.92-9.06L1 2h7.07l4.9 6.47L18.245 2zM17.1 20.06h1.85L7.02 3.84H5.04L17.1 20.06z"/>
    </svg>
  )
}

function GitHubModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="eyebrow">GitHub repository</span>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal__url" aria-label="repository URL">{GITHUB_URL}</div>
        <p className="modal__msg">◼ coming soon · open-source</p>
        <p className="modal__sub">
          The repository will go public when v1.0 ships. Follow our Telegram or X for the release.
        </p>
      </div>
    </div>
  )
}

export default function Nav({ route = '/' }) {
  const isDash = route === '/dashboard'
  const [ghOpen, setGhOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav__inner">
        <a href="#/" className="nav__logo" aria-label="Metamorphs home">
          <img src="/logo.png" alt="" className="nav__logo-img" width="28" height="28" />
          Metamorphs
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#/" aria-current={!isDash ? 'page' : undefined}>Home</a>
          <a href="#/#programs">Programs</a>
          <a href="#/#portfolio">Portfolio</a>
          <a href="#/#team">Agents</a>
          <a href="#/#faq">FAQ</a>
          <a href="#/dashboard" aria-current={isDash ? 'page' : undefined}>Dashboard</a>
        </nav>
        <span className="nav__spacer" />
        <div className="nav__socials" aria-label="Social links">
          <a
            href={GITHUB_URL}
            onClick={(e) => { e.preventDefault(); setGhOpen(true) }}
            aria-label="GitHub (coming soon)"
          >
            <IconGitHub />
          </a>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <IconTelegram />
          </a>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
            <IconX />
          </a>
        </div>
        <a href="#/dashboard" className="btn btn--small">Submit your idea</a>
      </div>
      <GitHubModal open={ghOpen} onClose={() => setGhOpen(false)} />
    </header>
  )
}
