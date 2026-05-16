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

// Debug
app.get('/api/debug', (_, res) => {
  res.json({
    envVars: {
      PORT: !!process.env.PORT,
      MONGO_URI: !!process.env.MONGO_URI,
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_API_KEY: !!process.env.EMAIL_API_KEY,
      WHATSAPP_TOKEN: !!process.env.WHATSAPP_TOKEN,
      WHATSAPP_PHONE_ID: !!process.env.WHATSAPP_PHONE_ID,
    },
    waTokenLength: process.env.WHATSAPP_TOKEN ? process.env.WHATSAPP_TOKEN.length : 0,
    waPhoneIdValue: process.env.WHATSAPP_PHONE_ID || '(empty)',
  })
})

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// Connect to MongoDB then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Golden Trans API running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    console.log('ℹ  Frontend will use localStorage fallback.')
    // Start server anyway so health check works
    app.listen(PORT, () => console.log(`⚠  Server running on port ${PORT} (no DB)`))
  })
