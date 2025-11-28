import express from 'express';
import { body } from 'express-validator';
import { getMyQRCode, scanQRCode } from '../controllers/qrController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// Get my QR code (guides)
router.get('/my', authenticate, authorize(UserRole.GUIDE), getMyQRCode);

// Scan QR code (admin/coordinator)
router.post(
  '/scan',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.COORDINATOR),
  validate([body('token').notEmpty()]),
  scanQRCode
);

export default router;
