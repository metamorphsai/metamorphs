const NUMBERS = [
  { v: '50+',   l: 'Products in motion',          sub: 'across web · mobile · SaaS' },
  { v: '6',     l: 'Specialist agents per project', sub: 'strategy → analytics' },
  { v: '~21d',  l: 'Median time-to-launch',       sub: 'idea to live' },
  { v: '94%',   l: 'Stage advance rate',           sub: 'projects that ship through' },
]

export default function ByNumbers() {
  return (
    <section className="section" id="numbers">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">By&nbsp;the&nbsp;Numbers</h2>
          </div>
          <div className="section__band-cell">
            <span className="eyebrow">What the agents have shipped</span>
          </div>
          <div className="section__band-cell" style={{ alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>LIVE METRICS · 30d</span>
          </div>
        </div>

        <div className="numbers-grid">
          {NUMBERS.map((n) => (
            <article key={n.l} className="ncell">
              <div className="ncell__value">{n.v}</div>
              <div className="ncell__label">{n.l}</div>
              <div className="ncell__sub">{n.sub}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
