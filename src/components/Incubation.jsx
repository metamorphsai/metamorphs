import LiquidHalftoneCanvas from './LiquidHalftoneCanvas.jsx'
import ThreeBadge from './ThreeBadge.jsx'

export default function Incubation() {
  return (
    <section className="section" id="incubation">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">Incubation</h2>
          </div>
          <div className="section__band-cell">
            <span className="label label-dot">End-to-End Support</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>From idea to launch</span>
          </div>
          <div className="section__band-cell">
            <span className="label label-dot">Unique Approach</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)' }}>Beyond model output</span>
          </div>
        </div>

        <div className="pillars">
          <div className="pillars__left">
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">01</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="6" width="20" height="16" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="4" y1="11" x2="24" y2="11" stroke="#0a0a0a" strokeWidth="2" />
                    <circle cx="8" cy="8.5" r="0.8" fill="#0a0a0a" />
                    <circle cx="11" cy="8.5" r="0.8" fill="#0a0a0a" />
                  </svg>
                </div>
                <span className="dual-card__title">Idea blueprint</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">02</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M4 22 L24 22 M8 22 V14 L14 12 L20 14 V22" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                    <rect x="11" y="16" width="6" height="6" stroke="#0a0a0a" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="dual-card__title">Team assembly</span>
              </div>
            </div>
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">03</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4 L24 14 L14 24 L4 14 Z" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                    <circle cx="14" cy="14" r="3" fill="#ff5a1f" />
                  </svg>
                </div>
                <span className="dual-card__title">Build & ship</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">04</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="#0a0a0a" strokeWidth="2" />
                    <path d="M14 4 V24 M4 14 H24 M7 7 L21 21 M21 7 L7 21" stroke="#0a0a0a" strokeWidth="1" />
                  </svg>
                </div>
                <span className="dual-card__title">Growth loop</span>
              </div>
            </div>
          </div>

          <div className="pillars__center pillars__center--wave cell--ticks">
            <LiquidHalftoneCanvas />
            <div className="acc__stage">
              <ThreeBadge variant="incubation" />
            </div>
            <p className="pillars__sub">
              A circular flywheel — strategy, build, launch in one continuous loop.
            </p>
          </div>

          <div className="pillars__right">
            <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.55, color: 'var(--fg-soft)' }}>
                Turn an idea into a shipped product. Our AI agent team owns strategy, design, build, and launch — so you keep your hands on the vision. Agents amplify, never replace.
              </p>
            </div>
            <div className="cta-row">
              <a href="#/dashboard" className="btn">Start building →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
