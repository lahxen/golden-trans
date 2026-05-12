import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bookingRoutes from './routes/bookings.js'

dotenv.config()

console.log('🚀 Server script started')
console.log('PORT:', process.env.PORT)

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/bookings', bookingRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

app.get('/api/debug', (_, res) => {
  res.json({
    envVars: {
      PORT: !!process.env.PORT,
      MONGO_URI: !!process.env.MONGO_URI,
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASS: !!process.env.EMAIL_PASS,
      WHATSAPP_TOKEN: !!process.env.WHATSAPP_TOKEN,
      WHATSAPP_PHONE_ID: !!process.env.WHATSAPP_PHONE_ID,
    }
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Golden Trans API listening on 0.0.0.0:${PORT}`)

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goldentrans'
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message)
    })
})
