import Booking from '../models/Booking.js'
import { sendEmailNotification, sendWANotification, sendCustomerReply } from '../services/notificationService.js'

// POST /api/bookings
export async function createBooking(req, res) {
  try {
    const booking = new Booking(req.body)
    await booking.save()

    // Fire notifications asynchronously (don't block response)
    Promise.allSettled([
      sendEmailNotification(booking),
      sendWANotification(booking),
      sendCustomerReply(booking),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') console.error(`[NOTIF ${i}]`, r.reason)
      })
    })

    res.status(201).json(booking)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate reference number.' })
    }
    res.status(400).json({ message: err.message })
  }
}

// GET /api/bookings
export async function getAllBookings(req, res) {
  try {
    const { status, limit = 100, skip = 0 } = req.query
    const filter = status ? { status } : {}
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
    const total = await Booking.countDocuments(filter)
    res.json({ bookings, total })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/bookings/:ref
export async function getBookingByRef(req, res) {
  try {
    const booking = await Booking.findOne({ ref: req.params.ref })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PATCH /api/bookings/:ref/status
export async function updateBookingStatus(req, res) {
  try {
    const { status, paymentStatus, transactionId } = req.body
    const update = {}
    if (status) update.status = status
    if (paymentStatus) update.paymentStatus = paymentStatus
    if (transactionId) update.transactionId = transactionId

    const booking = await Booking.findOneAndUpdate(
      { ref: req.params.ref },
      { $set: update },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/bookings/:ref  (soft cancel)
export async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findOneAndUpdate(
      { ref: req.params.ref },
      { $set: { status: 'cancelled' } },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json({ message: 'Booking cancelled.', booking })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
