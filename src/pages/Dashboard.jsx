import { useEffect, useState, useCallback } from 'react'
import StageCounters from '../components/dashboard/StageCounters.jsx'
import SubmitIdea from '../components/dashboard/SubmitIdea.jsx'
import ProjectCard from '../components/dashboard/ProjectCard.jsx'
import Tiers from '../components/dashboard/Tiers.jsx'
import LoginModal from '../components/dashboard/LoginModal.jsx'
import {
  loadProjects,
  createProject,
  advanceStage,
  deleteProject,
  updateProject,
  resetAll,
} from '../lib/projects.js'
import { generateBlueprint } from '../lib/blueprint.js'
import storage from '../lib/storage.js'
import Footer from '../components/Footer.jsx'

const AUTH_KEY = 'auth:v1'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [auth, setAuth] = useState(null)
  const [loginOpen, setLoginOpen] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const list = await loadProjects()
      setProjects(list)
    } catch (err) {
      setError(err?.message || 'Could not load projects.')
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const saved = await storage.get(AUTH_KEY)
        if (saved) setAuth(saved)
      } catch {}
      await refresh()
      setLoading(false)
    })()
  }, [refresh])

  const handleAuth = async (creds) => {
    try {
      await storage.set(AUTH_KEY, creds)
      setAuth(creds)
    } catch (err) {
      throw new Error(err?.message || 'Could not save credentials.')
    }
  }

  const handleLogout = async () => {
    try {
      await storage.remove(AUTH_KEY)
      setAuth(null)
    } catch (err) {
      setError(err?.message || 'Could not log out.')
    }
  }

  const handleSubmit = async ({ name, description, type }) => {
    setBusy(true)
    setError('')
    try {
      let blueprint = null
      try {
        blueprint = await generateBlueprint({ name, description, type })
      } catch (err) {
        console.warn('blueprint failed', err)
      }
      await createProject({ name, description, type, blueprint })
      await refresh()
    } catch (err) {
      setError(err?.message || 'Could not create project.')
      throw err
    } finally {
      setBusy(false)
    }
  }

  const handleAdvance = async (id) => {
    setBusy(true)
    try {
      await advanceStage(id)
      await refresh()
    } catch (err) {
      setError(err?.message || 'Could not advance stage.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setBusy(true)
    try {
      await deleteProject(id)
      await refresh()
    } catch (err) {
      setError(err?.message || 'Could not delete.')
    } finally {
      setBusy(false)
    }
  }

  const handleRename = async (id, patch) => {
    try {
      await updateProject(id, patch)
      await refresh()
    } catch (err) {
      setError(err?.message || 'Could not update.')
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Reset ALL project data? This cannot be undone.')) return
    setBusy(true)
    try {
      await resetAll()
      await refresh()
    } catch (err) {
      setError(err?.message || 'Could not reset.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="dash" id="dashboard">
        <div className="wrap">
          <div className="dash__head">
            <div className="dash__head-cell dash__head-cell--brand">
              <img src="/logo.png" alt="" className="dash__logo" width="72" height="72" />
              <div>
                <span className="hero__bracket">
                  <span>◆</span> DASHBOARD &nbsp;·&nbsp; PRODUCTS IN MOTION &nbsp;·&nbsp; INDEX 002
                </span>
                <h1 className="dash__title">YOUR&nbsp;PROJECTS<span className="dot">.</span></h1>
              </div>
            </div>
            <div className="dash__head-actions">
              <button type="button" className="btn btn--ghost btn--small" onClick={handleReset} disabled={busy || loading}>
                Reset data
              </button>
            </div>
          </div>

          <Tiers
            auth={auth}
            onLogin={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />

          <StageCounters projects={projects} />

          <SubmitIdea onSubmit={handleSubmit} busy={busy} />

          {error && <div className="dash__error">{error}</div>}

          {loading ? (
            <div className="dash__loading">Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="dash__empty">
              <span className="dash__empty-glyph" aria-hidden="true">◼</span>
              <h3>No projects yet</h3>
              <p>Submit your first idea above. An agent team will draft a blueprint and walk it through each stage to launch.</p>
            </div>
          ) : (
            <div className="dash__grid">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onAdvance={handleAdvance}
                  onDelete={handleDelete}
                  onRename={handleRename}
                  busy={busy}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onAuth={handleAuth}
      />
      <Footer />
    </>
  )
}
