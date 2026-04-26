import mongoose from 'mongoose'

const DealSchema = new mongoose.Schema({
  id:       Number,
  category: String,
  type:     String,
  brands:   [String],
}, { _id: false })

const BookingSchema = new mongoose.Schema(
  {
    ref:          { type: String, required: true, unique: true, index: true },

    // Customer
    name:         { type: String, required: true },
    phone:        { type: String, required: true },
    email:        { type: String, default: '' },
    country:      { type: String, default: 'Morocco' },

    // Trip
    pickup:       { type: String, required: true },
    dropoff:      { type: String, required: true },
    date:         { type: String, required: true },
    time:         { type: String, required: true },
    passengers:   { type: String, required: true },
    luggage:      { type: String, default: '0' },
    tripType:     { type: String, enum: ['one_way', 'round_trip'], default: 'one_way' },
    specialRequest: { type: String, default: '' },

    // Vehicle
    deal:         { type: DealSchema, required: true },
    totalPrice:   { type: Number, required: true },

    // Payment
    paymentMethod:  { type: String, enum: ['online', 'on_arrival'], required: true },
    paymentStatus:  {
      type: String,
      enum: ['pending', 'paid', 'pending_arrival', 'refunded'],
      default: 'pending',
    },
    transactionId:  { type: String, default: null },

    // Booking status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'paid', 'pay_on_arrival', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', BookingSchema)
