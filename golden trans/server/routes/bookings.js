import { Router } from 'express'
import { createBooking, getAllBookings, getBookingByRef, updateBooking } from '../controllers/bookingController.js'

const router = Router()

router.post('/',             createBooking)
router.get('/',              getAllBookings)
router.get('/:ref',          getBookingByRef)
router.patch('/:ref',        updateBooking)

export default router
