import Booking from '../models/Booking.js'
import { generateWAMessage } from '../services/aiService.js'
import { sendWAMessage } from '../services/whatsappService.js'

function generateRef() {
  const y = new Date().getFullYear()
  const c = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let r = ''
  for (let i = 0; i < 6; i++) r += c[Math.floor(Math.random() * c.length)]
  return `GT-${y}-${r}`
}

export async function createBooking(req, res) {
  try {
    const data = { ref: generateRef(), ...req.body, status: 'pending' }
    const booking = await Booking.create(data)

    // WhatsApp + AI en arrière-plan (pas bloquant)
    generateWAMessage(booking).then(msg => {
      if (msg) sendWAMessage(booking.phone, msg).then(() => {
        Booking.findOneAndUpdate({ ref: booking.ref }, { waSent: true }).catch(() => {})
      }).catch(() => {})
    }).catch(() => {})

    res.status(201).json(booking)
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Doublon.' })
    res.status(400).json({ message: err.message })
  }
}

export async function getAllBookings(req, res) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const bookings = await Booking.find(filter).sort({ createdAt: -1 })
    res.json({ bookings, total: bookings.length })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getBookingByRef(req, res) {
  try {
    const b = await Booking.findOne({ ref: req.params.ref })
    if (!b) return res.status(404).json({ message: 'Introuvable.' })
    res.json(b)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function updateBooking(req, res) {
  try {
    const b = await Booking.findOneAndUpdate(
      { ref: req.params.ref },
      { $set: req.body },
      { new: true }
    )
    if (!b) return res.status(404).json({ message: 'Introuvable.' })
    res.json(b)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
