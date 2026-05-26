import { useEffect, useState } from 'react'

const LAUNCH_AT = Date.UTC(2026, 4, 27, 15, 0, 0)

// ▼ Paste the contract address here when launch goes live. Leave '' to show "comingsoon".
const TOKEN_CA = ''
const PUMPFUN_BASE = 'https://pump.fun/coin/'

function pad(n) { return String(n).padStart(2, '0') }

function truncateCA(ca) {
  if (!ca) return ''
  if (ca.length <= 12) return ca
  return ca.slice(0, 6) + '…' + ca.slice(-4)
}

function useCountdown(target) {
  const [diff, setDiff] = useState(() => target - Date.now())
  useEffect(() => {
    const id = setInterval(() => setDiff(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, live: true }
  const s = Math.floor(diff / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    live: false,
  }
}

export default function TokenStrip() {
  const t = useCountdown(LAUNCH_AT)
  const [copied, setCopied] = useState(false)
  const hasCA = TOKEN_CA.length > 0
  const pumpHref = hasCA ? PUMPFUN_BASE + TOKEN_CA : 'https://pump.fun'

  const copyCA = async () => {
    if (!hasCA) return
    try {
      await navigator.clipboard.writeText(TOKEN_CA)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch {}
  }

  return (
    <section className="tstrip" aria-label="Token launch">
      <div className="tstrip__inner">
        <div className="tstrip__cell tstrip__status">
          <span className="tstrip__status-dot">{t.live ? '◼ LIVE' : '◼ T-MINUS'}</span>
          <span className="tstrip__date">MAY 27 · 3 PM UTC</span>
        </div>

        <div className="tstrip__cell tstrip__ticker">$MEMO</div>

        <div className="tstrip__cell tstrip__clock" aria-live="polite">
          <span><b>{pad(t.d)}</b>D</span>
          <span><b>{pad(t.h)}</b>H</span>
          <span><b>{pad(t.m)}</b>M</span>
          <span><b>{pad(t.s)}</b>S</span>
        </div>

        <button
          type="button"
          className={`tstrip__cell tstrip__ca${hasCA ? '' : ' is-empty'}`}
          onClick={copyCA}
          disabled={!hasCA}
          title={hasCA ? TOKEN_CA : 'CA coming soon'}
        >
          <span className="tstrip__ca-label">CA</span>
          <span className="tstrip__ca-value">{hasCA ? truncateCA(TOKEN_CA) : 'comingsoon'}</span>
          <span className="tstrip__ca-action">{hasCA ? (copied ? 'COPIED ✓' : 'COPY ⧉') : '—'}</span>
        </button>

        <a
          className={`tstrip__cell tstrip__pump${hasCA ? '' : ' is-disabled'}`}
          href={pumpHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!hasCA}
          onClick={(e) => { if (!hasCA) e.preventDefault() }}
        >
          <span className="tstrip__pump-mark">💊</span>
          <span>Buy on pump.fun</span>
          <span className="tstrip__pump-arrow">↗</span>
        </a>
      </div>
    </section>
  )
}
