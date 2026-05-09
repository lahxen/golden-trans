import { Router } from 'express'
import {
  createBooking,
  getAllBookings,
  getBookingByRef,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js'

const router = Router()

router.post('/',            createBooking)
router.get('/',             getAllBookings)
router.get('/:ref',         getBookingByRef)
router.patch('/:ref/status', updateBookingStatus)
router.delete('/:ref',      cancelBooking)

export default router
