import ThreeBadge from './ThreeBadge.jsx'

const FOCUS = ['Strategy', 'Design', 'Build', 'Launch']

export default function BeyondHardware() {
  return (
    <section className="section" id="programs">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">Beyond&nbsp;Models</h2>
          </div>
          <div className="section__band-cell">
            <span className="eyebrow">Supercharging Product Builders</span>
          </div>
          <div className="section__band-cell">
            <span className="label label-dot">End-to-End Build</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>Strategy → Launch in one team</span>
          </div>
        </div>

        <div className="pillars">
          <div className="pillars__left">
            <div className="tag-row"><span className="tag-row__check">✓</span><span className="tag-row__name">Strategy</span></div>
            <div className="tag-row"><span className="tag-row__check">✓</span><span className="tag-row__name">Design</span></div>
            <div className="tag-row"><span className="tag-row__check">✓</span><span className="tag-row__name">Build</span></div>
            <div className="tag-row"><span className="tag-row__check">✓</span><span className="tag-row__name">Launch</span></div>
            <div className="cta-row">
              <a href="#/dashboard" className="btn">Submit your idea →</a>
            </div>
          </div>

          <div className="pillars__center cell--ticks">
            <div className="acc__stage">
              <ThreeBadge variant="programs" />
            </div>
            <span className="pillars__sub">Open-source agents that build. Prompts, evals, blueprints, playbooks — shipped under permissive licenses so any team can stand them up.</span>
          </div>

          <div className="pillars__right">
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">01</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="3" y="3" width="22" height="22" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="3" y1="14" x2="25" y2="14" stroke="#0a0a0a" strokeWidth="2" />
                    <line x1="14" y1="3" x2="14" y2="25" stroke="#0a0a0a" strokeWidth="2" />
                  </svg>
                </div>
                <span className="dual-card__title">01 Incubation: Idea → MVP</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">02</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M3 22 L10 14 L16 18 L25 6" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                    <circle cx="25" cy="6" r="2" fill="#ff5a1f" />
                  </svg>
                </div>
                <span className="dual-card__title">02 Acceleration: MVP → Launch</span>
              </div>
            </div>
            <div className="dual-card">
              <div className="dual-card__cell">
                <span className="dual-card__num">03</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="#0a0a0a" strokeWidth="2" />
                    <path d="M14 4 L14 24 M4 14 L24 14" stroke="#0a0a0a" strokeWidth="2" />
                  </svg>
                </div>
                <span className="dual-card__title">03 Agent Tooling</span>
              </div>
              <div className="dual-card__cell">
                <span className="dual-card__num">04</span>
                <div className="dual-card__icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 6 H22 V12 L14 22 L6 12 Z" stroke="#0a0a0a" strokeWidth="2" fill="none" />
                  </svg>
                </div>
                <span className="dual-card__title">04 Go-to-Market</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
