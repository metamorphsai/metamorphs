// generateBlueprint(idea) → { targetUser, features, suggestedName, source }
// Strategy:
//   1. Try real backend at /api/blueprint (Claude via server-side key).
//   2. Try host-provided window.claude.complete (artifact sandbox style).
//   3. Fall back to deterministic local mock so the UI always works.

const TYPE_TARGETS = {
  Web:  'Indie founders shipping a web product',
  App:  'Mobile-first users who live on their phones',
  Tool: 'Power users who automate their daily workflows',
  SaaS: 'Small teams paying for time-saving software',
}

const FEATURE_TEMPLATES = [
  (name) => `Onboarding that gets ${name} usable in under a minute`,
  (name) => `One core flow that proves ${name}'s value on first session`,
  (name) => `Lightweight telemetry to show where users get stuck`,
]

function pickName(rawName, description) {
  const desc = (description || '').toLowerCase()
  const trimmed = (rawName || '').trim()
  if (trimmed && trimmed.length <= 16) return trimmed
  const seeds = ['Lumen', 'Pulse', 'Nimbus', 'Vector', 'Atlas', 'Compass', 'Quill', 'Beacon']
  const idx = (desc.length + (rawName?.length || 0)) % seeds.length
  return seeds[idx] + (desc.includes('ai') ? ' AI' : '')
}

function mockBlueprint({ name, description, type }) {
  return {
    targetUser: TYPE_TARGETS[type] || 'Builders who want to ship without staffing a team',
    features: FEATURE_TEMPLATES.map((fn) => fn(name || 'this product')),
    suggestedName: pickName(name, description),
    source: 'mock',
  }
}

async function tryServerAPI(payload) {
  const res = await fetch('/api/blueprint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = err.message || err.error || `HTTP ${res.status}`
    throw new Error(msg)
  }
  const data = await res.json()
  if (data && data.targetUser && Array.isArray(data.features) && data.suggestedName) {
    return data
  }
  throw new Error('invalid response shape')
}

async function tryHostClaude(payload) {
  if (typeof window === 'undefined' || !window.claude || typeof window.claude.complete !== 'function') {
    throw new Error('host claude not available')
  }
  const prompt = `You are a product strategist. Given an idea, return JSON with keys "targetUser" (one sentence), "features" (array of exactly 3 short feature strings), "suggestedName" (one short product name).
Idea name: ${payload.name || '(none yet)'}
Type: ${payload.type}
Description: ${payload.description}
Respond with only the JSON object, no prose.`
  const text = await window.claude.complete(prompt)
  const obj = JSON.parse(text)
  if (obj && obj.features && obj.targetUser && obj.suggestedName) {
    return { ...obj, source: 'claude' }
  }
  throw new Error('invalid host claude response')
}

export async function generateBlueprint({ name, description, type }) {
  const payload = { name, description, type }

  // 1. Backend API (production: real Anthropic call)
  try {
    return await tryServerAPI(payload)
  } catch (err) {
    console.warn('[blueprint] server API failed:', err.message)
  }

  // 2. Host-provided window.claude.complete (sandbox)
  try {
    return await tryHostClaude(payload)
  } catch {
    // silent — most environments won't have this
  }

  // 3. Local mock — always works
  return mockBlueprint(payload)
}
