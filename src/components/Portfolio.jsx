const PROJECTS = [
  { tag: '04 · Launch', name: 'TaskFlow', stats: [
    { v: 'Launch', l: 'Stage' }, { v: '100%', l: 'Build %' },
    { v: '6 / 6', l: 'Agents Active' }, { v: 'Yes', l: 'Launched?' },
  ]},
  { tag: '03 · Polish', name: 'InboxZero AI', stats: [
    { v: 'Polish', l: 'Stage' }, { v: '78%', l: 'Build %' },
    { v: '4 / 6', l: 'Agents Active' }, { v: 'Soon', l: 'Launched?' },
  ]},
  { tag: '02 · Build', name: 'Pixie Editor', stats: [
    { v: 'Build', l: 'Stage' }, { v: '42%', l: 'Build %' },
    { v: '3 / 6', l: 'Agents Active' }, { v: 'No', l: 'Launched?' },
  ]},
  { tag: '01 · Idea', name: 'Quanta CRM', stats: [
    { v: 'Idea', l: 'Stage' }, { v: '12%', l: 'Build %' },
    { v: '2 / 6', l: 'Agents Active' }, { v: 'No', l: 'Launched?' },
  ]},
]

export default function Portfolio() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="wrap">
        <div className="portfolio__title-row">
          <div className="portfolio__title-cell">
            <span className="eyebrow">Products in motion</span>
            <h2 className="h-section" style={{ marginTop: 12 }}>Port&nbsp;folio</h2>
          </div>
          <div className="portfolio__count">
            <span className="portfolio__count-label">All projects ↗</span>
            13
          </div>
        </div>

        <div className="portfolio__cards">
          {PROJECTS.map((p) => (
            <article key={p.name} className="pcard">
              <div className="pcard__tag">{p.tag}</div>
              <div className="pcard__name">▪ {p.name}</div>
              <div className="pcard__stats">
                {p.stats.map((s) => (
                  <div key={s.l} className="pcard__stat">
                    <div className="pcard__stat-val">{s.v}</div>
                    <div className="pcard__stat-lbl">{s.l}</div>
                  </div>
                ))}
              </div>
              <a className="pcard__cta" href="#/dashboard">
                View product <span>→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
