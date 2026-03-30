/**
 * FaceRecognitionService
 * Uses face-api.js loaded dynamically from CDN.
 * Stores face descriptors in IndexedDB (persists across sessions).
 * No server required — all processing is on-device (WebGL/WASM).
 */

const MODELS_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
const DB_NAME    = 'cpms_faces_db'
const DB_VER     = 1
const STORE      = 'face_descriptors'
const THRESHOLD  = 0.52  // Lower = stricter. 0.52 works well for webcam

let faceApiReady = false
let db = null

// ─── LOAD face-api.js from CDN ───────────────────────────────
export async function loadFaceApi() {
  if (faceApiReady) return true
  if (window.faceapi) {
    faceApiReady = true
    return true
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js'
    script.onload = async () => {
      try {
        await loadModels()
        faceApiReady = true
        resolve(true)
      } catch (e) {
        reject(e)
      }
    }
    script.onerror = () => reject(new Error('Не удалось загрузить face-api.js'))
    document.head.appendChild(script)
  })
}

async function loadModels() {
  const fa = window.faceapi
  await Promise.all([
    fa.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
    fa.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
    fa.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
  ])
}

// ─── INDEXEDDB ────────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    if (db) { resolve(db); return }
    const req = indexedDB.open(DB_NAME, DB_VER)
    req.onupgradeneeded = (e) => {
      const d = e.target.result
      if (!d.objectStoreNames.contains(STORE)) {
        d.createObjectStore(STORE, { keyPath: 'staffId' })
      }
    }
    req.onsuccess  = (e) => { db = e.target.result; resolve(db) }
    req.onerror    = (e) => reject(e.target.error)
  })
}

export async function saveFaceDescriptor(staffId, descriptor) {
  const d = await openDB()
  return new Promise((resolve, reject) => {
    const tx   = d.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    // descriptor is Float32Array — store as regular Array for IDB
    const req  = store.put({ staffId, descriptor: Array.from(descriptor) })
    req.onsuccess = () => resolve(true)
    req.onerror   = (e) => reject(e.target.error)
  })
}

export async function getAllFaceDescriptors() {
  const d = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = d.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const req   = store.getAll()
    req.onsuccess = (e) => resolve(e.target.result.map(r => ({
      staffId:    r.staffId,
      descriptor: new Float32Array(r.descriptor),
    })))
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function deleteFaceDescriptor(staffId) {
  const d = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = d.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const req   = store.delete(staffId)
    req.onsuccess = () => resolve(true)
    req.onerror   = (e) => reject(e.target.error)
  })
}

export async function hasFaceDescriptor(staffId) {
  const all = await getAllFaceDescriptors()
  return all.some(r => r.staffId === staffId)
}

// ─── CORE DETECTION ───────────────────────────────────────────
/**
 * Detect a single face in a video element and return its descriptor.
 * Returns null if no face found or multiple faces.
 */
export async function detectFaceDescriptor(videoOrCanvas) {
  if (!faceApiReady) throw new Error('face-api не загружен')
  const fa      = window.faceapi
  const options = new fa.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
  const result  = await fa.detectSingleFace(videoOrCanvas, options)
    .withFaceLandmarks(true)
    .withFaceDescriptor()
  return result || null
}

/**
 * Register a face — detect from video and save to IDB.
 */
export async function registerFace(staffId, videoEl) {
  const result = await detectFaceDescriptor(videoEl)
  if (!result) throw new Error('Лицо не обнаружено. Смотрите прямо в камеру.')
  await saveFaceDescriptor(staffId, result.descriptor)
  return true
}

/**
 * Identify a face from video against all stored descriptors.
 * Returns { staffId, distance } or null.
 */
export async function identifyFace(videoEl) {
  const result = await detectFaceDescriptor(videoEl)
  if (!result) return null

  const stored  = await getAllFaceDescriptors()
  if (stored.length === 0) return null

  const fa      = window.faceapi
  const matcher = new fa.FaceMatcher(
    stored.map(r => new fa.LabeledFaceDescriptors(r.staffId, [r.descriptor])),
    THRESHOLD
  )
  const match = matcher.findBestMatch(result.descriptor)
  if (match.label === 'unknown') return null
  return { staffId: match.label, distance: match.distance }
}

// ─── GEOLOCATION ─────────────────────────────────────────────
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается браузером'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat:      pos.coords.latitude,
        lon:      pos.coords.longitude,
        accuracy: Math.round(pos.coords.accuracy),
        timestamp: new Date().toISOString(),
      }),
      (err) => reject(new Error(
        err.code === 1 ? 'Доступ к геолокации запрещён пользователем' :
        err.code === 2 ? 'Не удалось определить местоположение' :
        'Таймаут определения местоположения'
      )),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  })
}

export function formatCoords(lat, lon) {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`
}

export function getMapsLink(lat, lon) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=16`
}
