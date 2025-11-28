import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = express.Router();

// Registration
router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('phone').isMobilePhone('any'),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty()
  ]),
  register
);

// Login
router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ]),
  login
);

// Get profile (authenticated)
router.get('/profile', authenticate, getProfile);

export default router;
