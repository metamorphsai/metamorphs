import { AGENTS } from '../../lib/agents.js'

const STATUS_LABEL = { idle: 'Idle', working: 'Working', done: 'Done' }

export default function AgentList({ agents }) {
  return (
    <div className="agent-list">
      {AGENTS.map((a) => {
        const status = agents?.[a.id] || 'idle'
        return (
          <div key={a.id} className={`agent agent--${status}`}>
            <span className="agent__initial">{a.initial}</span>
            <div className="agent__body">
              <div className="agent__name">{a.name}</div>
              <div className="agent__role">{a.role}</div>
            </div>
            <span className="agent__status">
              <span className={`agent__dot agent__dot--${status}`} aria-hidden="true" />
              {STATUS_LABEL[status]}
            </span>
          </div>
        )
      })}
    </div>
  )
}
