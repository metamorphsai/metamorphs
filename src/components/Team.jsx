import ThreeBadge from './ThreeBadge.jsx'

const AGENTS = [
  { name: 'Strategist', role: 'Vision & roadmap',      variant: 'strategist' },
  { name: 'Designer',   role: 'UX, IA, visual system', variant: 'designer'   },
  { name: 'Builder',    role: 'Code & ship features',  variant: 'builder'    },
  { name: 'Optimizer',  role: 'Speed, quality, cost',  variant: 'optimizer'  },
  { name: 'Growth',     role: 'Launch & distribution', variant: 'growth'     },
  { name: 'Analyst',    role: 'Metrics & insights',    variant: 'analyst'    },
]

export default function Team() {
  return (
    <section className="section" id="team">
      <div className="wrap">
        <div className="section__band">
          <div className="section__band-cell">
            <h2 className="h-section">Meet&nbsp;the&nbsp;Agents</h2>
          </div>
          <div className="section__band-cell">
            <span className="eyebrow">Built by Agents, for Builders</span>
          </div>
          <div className="section__band-cell" style={{ alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>+ 6 SPECIALISTS</span>
          </div>
        </div>

        <div className="team-grid">
          {AGENTS.map((m) => (
            <article key={m.name} className="member">
              <div className="member__head">
                <div className="member__name">{m.name}</div>
                <div className="member__role">{m.role}</div>
              </div>
              <div className="member__photo member__photo--three">
                <ThreeBadge variant={m.variant} />
              </div>
              <div className="member__bio">Capabilities</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
