import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  confirmBooking
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// Create booking (guides)
router.post(
  '/',
  authenticate,
  authorize(UserRole.GUIDE),
  validate([body('slot_id').isInt()]),
  createBooking
);

// Get my bookings (guides)
router.get('/my', authenticate, authorize(UserRole.GUIDE), getMyBookings);

// Cancel booking (guides)
router.post(
  '/:id/cancel',
  authenticate,
  authorize(UserRole.GUIDE),
  cancelBooking
);

// Confirm booking (admin/coordinator)
router.post(
  '/:id/confirm',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.COORDINATOR),
  confirmBooking
);

export default router;
