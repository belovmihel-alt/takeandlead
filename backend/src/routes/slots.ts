import express from 'express';
import { body } from 'express-validator';
import {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot
} from '../controllers/slotController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// Get all slots (public for guides)
router.get('/', authenticate, getSlots);

// Get slot by ID
router.get('/:id', authenticate, getSlotById);

// Create slot (admin/coordinator only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.COORDINATOR),
  validate([
    body('title').trim().notEmpty(),
    body('start_datetime').isISO8601(),
    body('end_datetime').isISO8601(),
    body('duration_min').isInt({ min: 15 }),
    body('base_fee').isFloat({ min: 0 })
  ]),
  createSlot
);

// Update slot (admin/coordinator only)
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.COORDINATOR),
  updateSlot
);

// Delete slot (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  deleteSlot
);

export default router;
