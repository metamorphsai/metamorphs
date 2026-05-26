import { STAGES } from '../../lib/agents.js'

export default function StageStepper({ stage }) {
  return (
    <div className="stepper" aria-label={`Stage ${stage + 1} of 4`}>
      {STAGES.map((s, i) => {
        const state = i < stage ? 'done' : i === stage ? 'active' : 'idle'
        return (
          <div key={s.id} className={`stepper__cell stepper__cell--${state}`}>
            <span className="stepper__glyph">{s.glyph}</span>
            <span className="stepper__name">{s.name}</span>
            <span className="stepper__label">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}
