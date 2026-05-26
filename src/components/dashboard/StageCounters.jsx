import { STAGES } from '../../lib/agents.js'

export default function StageCounters({ projects }) {
  const counts = STAGES.map((s) => projects.filter((p) => p.stage === s.id).length)
  return (
    <div className="counters">
      {STAGES.map((s, i) => (
        <div key={s.id} className="counter">
          <span className="counter__glyph">{s.glyph}</span>
          <span className="counter__value">{counts[i]}</span>
          <span className="counter__label">{s.name}</span>
        </div>
      ))}
    </div>
  )
}
