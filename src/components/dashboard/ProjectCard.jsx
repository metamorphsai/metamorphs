import { useState } from 'react'
import StageStepper from './StageStepper.jsx'
import AgentList from './AgentList.jsx'
import { STAGES, progressForStage } from '../../lib/agents.js'

export default function ProjectCard({ project, onAdvance, onDelete, onRename, busy }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: project.name, description: project.description })
  const stage = STAGES[project.stage] || STAGES[0]
  const progress = progressForStage(project.stage)
  const launched = project.stage === 3

  const saveEdit = (e) => {
    e.preventDefault()
    onRename(project.id, { name: draft.name.trim() || project.name, description: draft.description.trim() })
    setEditing(false)
  }

  return (
    <article className="project">
      <header className="project__head">
        <div className="project__tag">{stage.glyph} {stage.name}</div>
        <div className="project__type">{project.type}</div>
      </header>

      {editing ? (
        <form className="project__edit" onSubmit={saveEdit}>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            maxLength={48}
            placeholder="Product name"
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={2}
            maxLength={400}
          />
          <div className="project__edit-actions">
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--small">Save</button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="project__name">▪ {project.name}</h3>
          <p className="project__desc">{project.description}</p>
        </>
      )}

      <StageStepper stage={project.stage} />

      <div className="project__bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="project__bar-fill" style={{ width: progress + '%' }} />
        <span className="project__bar-label">{progress}% built</span>
      </div>

      {project.blueprint && (
        <div className="project__blueprint">
          <div className="project__blueprint-head">
            <span className="label label-dot">Blueprint</span>
            {project.blueprint.suggestedName && (
              <span className="project__blueprint-name">→ {project.blueprint.suggestedName}</span>
            )}
          </div>
          <div className="project__blueprint-target">For: {project.blueprint.targetUser}</div>
          <ul className="project__blueprint-features">
            {(project.blueprint.features || []).map((f) => (
              <li key={f}>+ {f}</li>
            ))}
          </ul>
        </div>
      )}

      <AgentList agents={project.agents} />

      <footer className="project__foot">
        <button
          type="button"
          className="btn btn--small"
          onClick={() => onAdvance(project.id)}
          disabled={launched || busy}
        >
          {launched ? '✓ Launched' : 'Advance →'}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setEditing((v) => !v)}
          disabled={busy}
        >
          {editing ? 'Close' : 'Edit'}
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--small project__del"
          onClick={() => onDelete(project.id)}
          disabled={busy}
        >
          Delete
        </button>
      </footer>
    </article>
  )
}
