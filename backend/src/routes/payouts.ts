import express from 'express';
import { body } from 'express-validator';
import {
  getMyEarnings,
  createPayout,
  markPayoutAsPaid
} from '../controllers/payoutController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// Get my earnings (guides)
router.get('/my/earnings', authenticate, authorize(UserRole.GUIDE), getMyEarnings);

// Create payout (admin)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  validate([
    body('guide_id').isInt(),
    body('booking_ids').isArray(),
    body('period_from').optional().isISO8601(),
    body('period_to').optional().isISO8601()
  ]),
  createPayout
);

// Mark payout as paid (admin)
router.post(
  '/:id/paid',
  authenticate,
  authorize(UserRole.ADMIN),
  markPayoutAsPaid
);

export default router;
