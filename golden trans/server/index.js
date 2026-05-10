import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bookingRoutes from './routes/bookings.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goldentrans'

// Middleware
app.use(cors({ origin: ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean) }))
app.use(express.json())

// Routes
app.use('/api/bookings', bookingRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// Start server first, then connect to MongoDB
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Golden Trans API starting on port ${PORT}`)

  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message)
      console.log('ℹ  Frontend will use localStorage fallback.')
    })
})
