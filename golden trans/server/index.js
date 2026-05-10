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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Golden Trans API listening on 0.0.0.0:${PORT}`)

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goldentrans'
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message)
    })
})
