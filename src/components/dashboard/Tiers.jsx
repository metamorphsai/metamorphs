const INCUBATOR_FEATURES = [
  'Idea blueprint generator',
  '6 AI specialist agents',
  '4-stage tracking + agent status',
  'Persistent local storage',
  'Unlimited free projects',
]

const ACCELERATION_FEATURES = [
  'Multi-product workspace',
  'Real Claude blueprints (Sonnet 4.6)',
  'Slack + Linear sync',
  'Priority Builder agent (faster ship)',
  'Custom agent training on your codebase',
]

function shortAuth(auth) {
  if (!auth) return ''
  if (auth.email) return auth.email
  if (auth.wallet) {
    const w = auth.wallet
    return w.length > 14 ? w.slice(0, 5) + '…' + w.slice(-4) : w
  }
  return ''
}

export default function Tiers({ auth, onLogin, onLogout }) {
  const isAuthed = !!auth

  return (
    <div className="tiers">
      <article className="tier tier--free">
        <header className="tier__head">
          <span className="tier__badge">Free</span>
          <span className="tier__num">01</span>
        </header>
        <h3 className="tier__name">Incubator</h3>
        <p className="tier__pitch">
          Take your idea from blueprint to MVP. No login required — everything below already works.
        </p>
        <ul className="tier__features">
          {INCUBATOR_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="tier__foot">
          <span className="tier__active">✓ Active</span>
        </div>
      </article>

      <article className={`tier tier--premium${isAuthed ? ' is-unlocked' : ''}`}>
        <header className="tier__head">
          <span className="tier__badge tier__badge--premium">Premium</span>
          <span className="tier__num">02</span>
        </header>
        <h3 className="tier__name">Acceleration</h3>
        <p className="tier__pitch">
          Scale and launch. Multi-product workspace + priority agents + real Claude integration.
        </p>
        <ul className="tier__features">
          {ACCELERATION_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="tier__foot">
          {isAuthed ? (
            <>
              <span className="tier__active">✓ Unlocked · {shortAuth(auth)}</span>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={onLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <button type="button" className="btn" onClick={onLogin}>
              Login to unlock →
            </button>
          )}
        </div>
      </article>
    </div>
  )
}
