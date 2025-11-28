import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getAllBookings,
  getAttendanceRecords,
  createMotivationCampaign,
  getAuditLogs
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// All routes require admin/coordinator access
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.COORDINATOR));

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Get all bookings
router.get('/bookings', getAllBookings);

// Get attendance records
router.get('/attendance', getAttendanceRecords);

// Create motivation campaign (admin only)
router.post(
  '/campaigns',
  authorize(UserRole.ADMIN),
  validate([
    body('name').trim().notEmpty(),
    body('rules').isObject()
  ]),
  createMotivationCampaign
);

// Get audit logs (admin only)
router.get('/audit-logs', authorize(UserRole.ADMIN), getAuditLogs);

export default router;
