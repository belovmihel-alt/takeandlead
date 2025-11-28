import express from 'express';
import {
  getAllGuides,
  getGuideById,
  updateMyProfile,
  getGuideStats
} from '../controllers/guideController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = express.Router();

// Get all guides (admin/coordinator)
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.COORDINATOR),
  getAllGuides
);

// Get guide by ID
router.get('/:id', authenticate, getGuideById);

// Update my profile (guides)
router.put('/my/profile', authenticate, authorize(UserRole.GUIDE), updateMyProfile);

// Get my stats (guides)
router.get('/my/stats', authenticate, authorize(UserRole.GUIDE), getGuideStats);

export default router;
