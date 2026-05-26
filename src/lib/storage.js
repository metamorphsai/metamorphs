// window.storage — IndexedDB-backed key/value store, attached as a global
// so the rest of the app can call window.storage.get/set/remove/clear.
// Persistent across reloads, not localStorage.

const DB_NAME = 'metamorphs'
const STORE = 'kv'
const DB_VERSION = 1

let dbPromise = null

function openDB() {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not available'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx(mode) {
  return openDB().then((db) => db.transaction(STORE, mode).objectStore(STORE))
}

function promisify(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const storage = {
  async get(key) {
    const s = await tx('readonly')
    const val = await promisify(s.get(key))
    return val === undefined ? null : val
  },
  async set(key, value) {
    const s = await tx('readwrite')
    await promisify(s.put(value, key))
    return value
  },
  async remove(key) {
    const s = await tx('readwrite')
    await promisify(s.delete(key))
  },
  async clear() {
    const s = await tx('readwrite')
    await promisify(s.clear())
  },
}

// Attach as polyfill if not already provided by environment.
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = storage
}

export default storage
