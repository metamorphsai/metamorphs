const CASES = [
  {
    type: 'Web App',
    short: 'Marketing sites, dashboards, SaaS portals — anything that lives in a browser.',
    example: 'TaskFlow',
    time: '2–4 wks',
    icon: (
      <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="5" width="22" height="18" stroke="currentColor" strokeWidth="2" />
        <line x1="3" y1="10" x2="25" y2="10" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="7.5" r="0.7" fill="currentColor" />
        <circle cx="8" cy="7.5" r="0.7" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'Mobile App',
    short: 'iOS or Android with native UX, deep-linked flows, push-ready.',
    example: 'FieldNote',
    time: '4–8 wks',
    icon: (
      <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="3" width="12" height="22" stroke="currentColor" strokeWidth="2" rx="2" />
        <circle cx="14" cy="21" r="1.2" fill="currentColor" />
        <line x1="11" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    type: 'Internal Tool',
    short: 'Ops dashboards, admin panels, AI copilots for your team.',
    example: 'BuildOps',
    time: '1–3 wks',
    icon: (
      <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="4" width="22" height="20" stroke="currentColor" strokeWidth="2" />
        <line x1="3" y1="11" x2="25" y2="11" stroke="currentColor" strokeWidth="2" />
        <line x1="9" y1="11" x2="9" y2="24" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="14" width="12" height="2" fill="currentColor" />
        <rect x="11" y="18" width="8" height="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'SaaS Product',
    short: 'Auth, billing, multi-tenant, and analytics wired in from day one.',
    example: 'Quanta CRM',
    time: '3–6 wks',
    icon: (
      <svg width="34" height="34" viewBox="0 0 28 28" fill="none">
        <path d="M4 18 V10 L14 4 L24 10 V18 L14 24 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="14" cy="14" r="3" fill="currentColor" />
      </svg>
    ),
  },
]

export default function UseCases() {
  return (
    <section className="section" id="usecases">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">Use&nbsp;Cases</h2>
          </div>
          <div className="section__band-cell">
            <span className="eyebrow">Built for makers</span>
          </div>
          <div className="section__band-cell" style={{ alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>+ ANY DIGITAL PRODUCT</span>
          </div>
        </div>

        <div className="usecase-grid">
          {CASES.map((c) => (
            <article key={c.type} className="usecard">
              <div className="usecard__icon" aria-hidden="true">{c.icon}</div>
              <h3 className="usecard__type">{c.type}</h3>
              <p className="usecard__short">{c.short}</p>
              <div className="usecard__foot">
                <span className="usecard__example">e.g. {c.example}</span>
                <span className="usecard__time">{c.time}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
