import LiquidHalftoneCanvas from './LiquidHalftoneCanvas.jsx'
import ThreeBadge from './ThreeBadge.jsx'

export default function Acceleration() {
  return (
    <section className="section" id="acceleration">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">Acceleration</h2>
          </div>
          <div className="section__band-cell">
            <span className="label label-dot">Launch & Beyond</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>MVP → public launch</span>
          </div>
          <div className="section__band-cell">
            <span className="label label-dot">Unique Approach</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>Distribution loops built-in</span>
          </div>
        </div>

        <div className="pillars">
          <div className="pillars__left">
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">01</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M5 14 L11 20 L23 6" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className="dual-card__title">Polish & QA</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">02</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="4" width="20" height="20" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="4" y1="9" x2="24" y2="9" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="9" y1="14" x2="19" y2="14" stroke="#0a0a0a" strokeWidth="1.5" />
                    <line x1="9" y1="18" x2="16" y2="18" stroke="#0a0a0a" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="dual-card__title">Launch playbook</span>
              </div>
            </div>
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">03</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="10" r="4" stroke="#0a0a0a" strokeWidth="2" />
                    <path d="M6 24 Q14 16, 22 24" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className="dual-card__title">Onboarding optimization</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">04</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M4 16 C4 16, 9 8, 14 14 C19 20, 24 12, 24 12" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                    <circle cx="24" cy="12" r="2" fill="#ff5a1f" />
                  </svg>
                </div>
                <span className="dual-card__title">Retention loops</span>
              </div>
            </div>
          </div>

          <div className="pillars__center pillars__center--wave cell--ticks">
            <LiquidHalftoneCanvas />
            <div className="acc__stage">
              <ThreeBadge variant="acceleration" />
            </div>
            <p className="pillars__sub">
              From working MVP to public launch — agents handle polish, distribution, and retention.
            </p>
          </div>

          <div className="pillars__right">
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.55, color: 'var(--fg-soft)' }}>
                The hard part of shipping isn't building — it's getting users to care. Our Growth and Analyst agents handle distribution, launch sequencing, and retention experiments while you iterate on the product.
              </p>
            </div>
            <div className="cta-row">
              <a href="#/dashboard" className="btn">Plan your launch →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
