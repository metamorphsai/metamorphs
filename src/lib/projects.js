import storage from './storage.js'
import { agentsAtStage } from './agents.js'

const KEY = 'projects:v1'

function uid() {
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

export async function loadProjects() {
  try {
    const arr = await storage.get(KEY)
    return Array.isArray(arr) ? arr : []
  } catch (err) {
    console.error('[projects] load failed', err)
    return []
  }
}

async function persist(list) {
  try {
    await storage.set(KEY, list)
  } catch (err) {
    console.error('[projects] persist failed', err)
  }
}

export async function createProject({ name, description, type, blueprint = null }) {
  const list = await loadProjects()
  const project = {
    id: uid(),
    name: name.trim(),
    description: description.trim(),
    type,
    stage: 0,
    agents: agentsAtStage(0),
    blueprint,
    createdAt: new Date().toISOString(),
  }
  const next = [project, ...list]
  await persist(next)
  return project
}

export async function advanceStage(id) {
  const list = await loadProjects()
  const next = list.map((p) => {
    if (p.id !== id) return p
    const nextStage = Math.min(3, p.stage + 1)
    return { ...p, stage: nextStage, agents: agentsAtStage(nextStage) }
  })
  await persist(next)
  return next.find((p) => p.id === id)
}

export async function updateProject(id, patch) {
  const list = await loadProjects()
  const next = list.map((p) => (p.id === id ? { ...p, ...patch } : p))
  await persist(next)
  return next.find((p) => p.id === id)
}

export async function deleteProject(id) {
  const list = await loadProjects()
  const next = list.filter((p) => p.id !== id)
  await persist(next)
}

export async function resetAll() {
  try {
    await storage.remove(KEY)
  } catch (err) {
    console.error('[projects] reset failed', err)
  }
}
