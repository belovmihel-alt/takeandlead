import { Request, Response } from 'express';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Total guides
    const totalGuides = await db('guides').count('* as count').first();

    // Active guides (with bookings in last 30 days)
    const activeGuides = await db('guides')
      .countDistinct('guides.id as count')
      .leftJoin('bookings', 'guides.id', 'bookings.guide_id')
      .where('bookings.booked_at', '>', db.raw("NOW() - INTERVAL '30 days'"))
      .first();

    // Total slots this month
    const totalSlotsThisMonth = await db('slots')
      .count('* as count')
      .where('start_datetime', '>', db.raw("DATE_TRUNC('month', NOW())"))
      .first();

    // Assigned slots
    const assignedSlots = await db('slots')
      .count('* as count')
      .where('status', 'assigned')
      .where('start_datetime', '>', db.fn.now())
      .first();

    // Pending bookings
    const pendingBookings = await db('bookings')
      .count('* as count')
      .where('status', 'requested')
      .first();

    // Total payouts this month
    const payoutsThisMonth = await db('payouts')
      .sum('amount as total')
      .where('created_at', '>', db.raw("DATE_TRUNC('month', NOW())"))
      .first();

    res.json({
      total_guides: parseInt(totalGuides?.count as string || '0'),
      active_guides: parseInt(activeGuides?.count as string || '0'),
      total_slots_this_month: parseInt(totalSlotsThisMonth?.count as string || '0'),
      assigned_slots: parseInt(assignedSlots?.count as string || '0'),
      pending_bookings: parseInt(pendingBookings?.count as string || '0'),
      total_payouts_this_month: parseFloat(payoutsThisMonth?.total || '0')
    });
  } catch (error) {
    throw new AppError('Failed to fetch dashboard stats', 500);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { status, from, to } = req.query;

    let query = db('bookings')
      .select(
        'bookings.*',
        'slots.title',
        'slots.start_datetime',
        'slots.end_datetime',
        'slots.hall',
        'guides.full_name as guide_name'
      )
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .leftJoin('guides', 'bookings.guide_id', 'guides.id');

    if (status) {
      query = query.where('bookings.status', status);
    }

    if (from) {
      query = query.where('slots.start_datetime', '>=', from);
    }

    if (to) {
      query = query.where('slots.end_datetime', '<=', to);
    }

    const bookings = await query.orderBy('slots.start_datetime', 'desc');

    res.json(bookings);
  } catch (error) {
    throw new AppError('Failed to fetch bookings', 500);
  }
};

export const getAttendanceRecords = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    let query = db('attendance')
      .select(
        'attendance.*',
        'bookings.id as booking_id',
        'guides.full_name as guide_name',
        'slots.title',
        'slots.start_datetime',
        'users.email as scanner_email'
      )
      .leftJoin('bookings', 'attendance.booking_id', 'bookings.id')
      .leftJoin('guides', 'bookings.guide_id', 'guides.id')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .leftJoin('users', 'attendance.scanner_id', 'users.id');

    if (from) {
      query = query.where('attendance.scanned_at', '>=', from);
    }

    if (to) {
      query = query.where('attendance.scanned_at', '<=', to);
    }

    const records = await query.orderBy('attendance.scanned_at', 'desc');

    res.json(records);
  } catch (error) {
    throw new AppError('Failed to fetch attendance records', 500);
  }
};

export const createMotivationCampaign = async (req: AuthRequest, res: Response) => {
  try {
    const { name, rules } = req.body;

    // Deactivate all existing campaigns
    await db('admin_campaigns').update({ active: false });

    // Create new campaign
    const [campaign] = await db('admin_campaigns')
      .insert({
        name,
        rules: JSON.stringify(rules),
        active: true
      })
      .returning('*');

    res.status(201).json(campaign);
  } catch (error) {
    throw new AppError('Failed to create campaign', 500);
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { action, user_id, from, to, limit = 100 } = req.query;

    let query = db('audit_logs')
      .select('audit_logs.*', 'users.email')
      .leftJoin('users', 'audit_logs.user_id', 'users.id');

    if (action) {
      query = query.where('audit_logs.action', action);
    }

    if (user_id) {
      query = query.where('audit_logs.user_id', user_id);
    }

    if (from) {
      query = query.where('audit_logs.created_at', '>=', from);
    }

    if (to) {
      query = query.where('audit_logs.created_at', '<=', to);
    }

    const logs = await query
      .orderBy('audit_logs.created_at', 'desc')
      .limit(parseInt(limit as string));

    res.json(logs);
  } catch (error) {
    throw new AppError('Failed to fetch audit logs', 500);
  }
};
