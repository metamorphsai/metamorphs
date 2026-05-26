/**
 * Metamorphs blueprint API
 * Listens on 127.0.0.1:3001, behind nginx reverse proxy.
 * Daily quota enforced globally (10 calls/day total) to cap cost.
 * After quota, returns 429 — frontend falls back to mock blueprint.
 */

const express = require('express')
const fs = require('fs')
const path = require('path')
const Anthropic = require('@anthropic-ai/sdk').default

const PORT = 3001
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '10', 10)
const MODEL = process.env.MODEL || 'claude-haiku-4-5-20251001'
const QUOTA_FILE = path.join(__dirname, 'quota.json')

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('FATAL: ANTHROPIC_API_KEY env var not set')
  process.exit(1)
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function today() {
  return new Date().toISOString().slice(0, 10)
}

function loadQuota() {
  try {
    const d = JSON.parse(fs.readFileSync(QUOTA_FILE, 'utf8'))
    if (d.date === today()) return d
  } catch {}
  return { date: today(), count: 0 }
}

function saveQuota(q) {
  try { fs.writeFileSync(QUOTA_FILE, JSON.stringify(q)) } catch (e) { console.warn('quota save failed', e.message) }
}

const app = express()
app.use(express.json({ limit: '10kb' }))
app.disable('x-powered-by')

app.get('/api/health', (_req, res) => {
  const q = loadQuota()
  res.json({ ok: true, model: MODEL, quotaUsed: q.count, quotaLimit: DAILY_LIMIT, date: q.date })
})

app.post('/api/blueprint', async (req, res) => {
  const { name, description, type } = req.body || {}

  if (typeof description !== 'string' || description.trim().length < 5) {
    return res.status(400).json({ error: 'description required (min 5 chars)' })
  }
  if (description.length > 1000 || (name || '').length > 100) {
    return res.status(400).json({ error: 'input too long' })
  }

  const q = loadQuota()
  if (q.count >= DAILY_LIMIT) {
    return res.status(429).json({
      error: 'daily_quota_exceeded',
      message: `Daily limit of ${DAILY_LIMIT} AI blueprints reached. Try again tomorrow.`,
      quotaUsed: q.count,
      quotaLimit: DAILY_LIMIT,
    })
  }

  const prompt = `You are a sharp product strategist. Given a product idea, respond with ONLY a JSON object (no prose, no code fences). Required keys:
- "targetUser": one specific sentence describing who the product is for.
- "features": array of exactly 3 short feature strings (each <= 80 chars).
- "suggestedName": one concise product name (<= 24 chars).

Idea name: ${name || '(none yet)'}
Product type: ${type || 'Web'}
Description: ${description.trim()}

Respond with the JSON object only.`

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = (message.content?.[0]?.text || '').trim()
    const jsonStr = text.match(/\{[\s\S]*\}/)?.[0]
    if (!jsonStr) throw new Error('no JSON in response')
    const parsed = JSON.parse(jsonStr)

    if (
      typeof parsed.targetUser !== 'string' ||
      !Array.isArray(parsed.features) ||
      typeof parsed.suggestedName !== 'string'
    ) {
      throw new Error('invalid blueprint shape')
    }

    q.count += 1
    saveQuota(q)

    res.json({
      targetUser: parsed.targetUser,
      features: parsed.features.slice(0, 3).map(String),
      suggestedName: parsed.suggestedName,
      source: 'claude',
      quotaUsed: q.count,
      quotaLimit: DAILY_LIMIT,
    })
  } catch (err) {
    console.error('[blueprint] error:', err.message)
    res.status(500).json({ error: err.message || 'API call failed' })
  }
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`metamorphs-api listening on 127.0.0.1:${PORT}, model=${MODEL}, limit=${DAILY_LIMIT}/day`)
})
