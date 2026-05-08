import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bookingRoutes from './routes/bookings.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/goldentrans'

app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:3000'].filter(Boolean) }))
app.use(express.json())
app.use('/api/bookings', bookingRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server on port ${PORT}`))
  })
  .catch(err => {
    console.error('MongoDB error:', err.message)
    app.listen(PORT, () => console.log(`Server on port ${PORT} (no DB)`))
  })
