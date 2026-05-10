const API_BASE = import.meta.env.VITE_API_URL
const STORAGE_KEY = 'gt_bookings'

export function generateRef() {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let rand = ''
  for (let i = 0; i < 6; i++) rand += chars[Math.floor(Math.random() * chars.length)]
  return `GT-${year}-${rand}`
}

export function calculatePrice(deal, tripType) {
  const multiplier = tripType === 'round_trip' ? 1.8 : 1
  return Math.round(deal.basePrice * multiplier)
}

export async function saveBooking(payload) {
  const ref = generateRef()
  const totalPrice = calculatePrice(payload.deal, payload.tripData.tripType)

  const booking = {
    ref,
    ...payload.tripData,
    deal: {
      id: payload.deal.id,
      category: payload.deal.category,
      type: payload.deal.type,
      brands: payload.deal.brands,
    },
    totalPrice,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === 'online' ? 'paid' : 'pending_arrival',
    status: payload.paymentMethod === 'online' ? 'confirmed' : 'pay_on_arrival',
    transactionId: payload.paymentMethod === 'online' ? `tok_mock_${ref}` : null,
    createdAt: new Date().toISOString(),
  }

  // Try the real backend first (3-second timeout)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 3000)
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    if (res.ok) return await res.json()
  } catch {
    clearTimeout(timeoutId)
    // Backend unavailable — fall through to localStorage
  }

  // localStorage fallback
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  existing.unshift(booking)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
  return booking
}

export function getBookings() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

export function updateBookingStatus(ref, updates) {
  const bookings = getBookings()
  const idx = bookings.findIndex(b => b.ref === ref)
  if (idx === -1) return null
  bookings[idx] = { ...bookings[idx], ...updates, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
  return bookings[idx]
}
