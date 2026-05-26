import { useEffect, useState } from 'react'

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

export default function LoginModal({ open, onClose, onAuth }) {
  const [tab, setTab] = useState('email')
  const [email, setEmail] = useState('')
  const [walletAddr, setWalletAddr] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setEmail('')
      setWalletAddr('')
      setError('')
      setBusy(false)
      setTab('email')
    }
  }, [open])

  if (!open) return null

  const finish = async (creds) => {
    setBusy(true)
    try {
      await onAuth(creds)
      onClose()
    } catch (err) {
      setError(err?.message || 'Could not log in.')
    } finally {
      setBusy(false)
    }
  }

  const submitEmail = (e) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    finish({ email: email.trim() })
  }

  const connectPhantom = async () => {
    setError('')
    const sol = typeof window !== 'undefined' ? window.solana : null
    if (!sol || !sol.isPhantom) {
      setError('Phantom not detected. Install it from phantom.app, or paste your address below.')
      return
    }
    setBusy(true)
    try {
      const resp = await sol.connect()
      const address = resp.publicKey.toString()
      await finish({ wallet: address, provider: 'phantom' })
    } catch (err) {
      setError(err?.message || 'Phantom connection cancelled.')
      setBusy(false)
    }
  }

  const submitManualWallet = (e) => {
    e.preventDefault()
    setError('')
    if (walletAddr.trim().length < 16) {
      setError('Enter a valid wallet address (16+ chars).')
      return
    }
    finish({ wallet: walletAddr.trim(), provider: 'manual' })
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal modal--login" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <span className="eyebrow">Unlock Acceleration</span>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <p className="login__pitch">
          Acceleration features require a quick identity check. Pick either route.
        </p>

        <div className="login__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'email'}
            className={`login__tab${tab === 'email' ? ' is-active' : ''}`}
            onClick={() => setTab('email')}
            disabled={busy}
          >
            Email
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'wallet'}
            className={`login__tab${tab === 'wallet' ? ' is-active' : ''}`}
            onClick={() => setTab('wallet')}
            disabled={busy}
          >
            Wallet
          </button>
        </div>

        {tab === 'email' ? (
          <form className="login__pane" onSubmit={submitEmail}>
            <label className="login__field">
              <span>Your email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@product.co"
                autoFocus
                disabled={busy}
              />
            </label>
            {error && <p className="login__error">{error}</p>}
            <button type="submit" className="btn" disabled={busy}>
              {busy ? 'Working…' : 'Login →'}
            </button>
            <p className="login__hint">No password — we send a magic link (mock).</p>
          </form>
        ) : (
          <div className="login__pane">
            <button
              type="button"
              className="btn login__phantom"
              onClick={connectPhantom}
              disabled={busy}
            >
              <span className="login__phantom-mark">⬣</span>
              {busy ? 'Connecting…' : 'Connect Phantom'}
            </button>

            <div className="login__divider">or paste address</div>

            <form onSubmit={submitManualWallet} className="login__manual">
              <label className="login__field">
                <span>Solana wallet address</span>
                <input
                  type="text"
                  value={walletAddr}
                  onChange={(e) => setWalletAddr(e.target.value)}
                  placeholder="9xQe…mqK1"
                  disabled={busy}
                />
              </label>
              {error && <p className="login__error">{error}</p>}
              <button type="submit" className="btn btn--ghost" disabled={busy}>
                Use this address
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
