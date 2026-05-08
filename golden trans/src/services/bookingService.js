const API = 'http://localhost:5000/api/bookings'
const STORAGE_KEY = 'gt_bookings'

export async function saveBooking(data) {
  data.waConsent = true
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    if (res.ok) return await res.json()
  } catch {
    clearTimeout(timeout)
  }

  const fallback = { ref: `OFF-${Date.now()}`, ...data, createdAt: new Date().toISOString() }
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  existing.unshift(fallback)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  return fallback
}
