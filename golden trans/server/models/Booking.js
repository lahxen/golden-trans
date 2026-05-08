import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  ref:          { type: String, required: true, unique: true },
  type:         { type: String, enum: ['with_driver', 'without_driver'], required: true },

  // Customer
  name:         { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String, default: '' },

  // Vehicle
  vehicle:      { type: String, required: true },
  passengers:   { type: Number, default: 1 },
  notes:        { type: String, default: '' },

  // With driver
  from:         { type: String, default: '' },
  to:           { type: String, default: '' },
  date:         { type: String, default: '' },
  time:         { type: String, default: '' },

  // Without driver
  pickupCity:   { type: String, default: '' },
  returnCity:   { type: String, default: '' },
  pickupDate:   { type: String, default: '' },
  pickupTime:   { type: String, default: '' },
  returnDate:   { type: String, default: '' },
  returnTime:   { type: String, default: '' },

  // Meta
  status:       { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['online', 'ondelivery'], default: 'ondelivery' },
  waSent:       { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Booking', BookingSchema)
