import { useState } from 'react'

const TYPES = ['Web', 'App', 'Tool', 'SaaS']

export default function SubmitIdea({ onSubmit, busy }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('Web')
  const [error, setError] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required.')
      return
    }
    try {
      await onSubmit({ name, description, type })
      setName('')
      setDescription('')
      setType('Web')
    } catch (err) {
      setError(err?.message || 'Could not submit. Try again.')
    }
  }

  return (
    <form className="submit-form" onSubmit={handle} aria-busy={busy}>
      <div className="submit-form__head">
        <span className="eyebrow">Submit your idea</span>
        <span className="label">Stage 01 · Idea</span>
      </div>

      <div className="submit-form__grid">
        <label className="submit-form__field">
          <span>Product name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. TaskFlow"
            disabled={busy}
            maxLength={48}
          />
        </label>

        <label className="submit-form__field submit-form__field--type">
          <span>Type</span>
          <div className="submit-form__chips" role="radiogroup" aria-label="Product type">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                className={`chip${type === t ? ' is-active' : ''}`}
                onClick={() => setType(t)}
                disabled={busy}
              >
                {t}
              </button>
            ))}
          </div>
        </label>

        <label className="submit-form__field submit-form__field--wide">
          <span>Describe the idea</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What problem does it solve? Who is it for?"
            disabled={busy}
            maxLength={400}
          />
        </label>
      </div>

      {error && <div className="submit-form__error">{error}</div>}

      <div className="submit-form__foot">
        <span className="submit-form__hint">
          {busy ? 'Generating blueprint…' : 'Agents will draft a blueprint on submit.'}
        </span>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Working…' : 'Start building →'}
        </button>
      </div>
    </form>
  )
}
