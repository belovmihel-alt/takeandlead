import { Request, Response } from 'express';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getAllGuides = async (req: Request, res: Response) => {
  try {
    const { status, language } = req.query;

    let query = db('guides')
      .select('guides.*', 'users.email', 'users.phone')
      .leftJoin('users', 'guides.user_id', 'users.id');

    if (status) {
      query = query.where('guides.status', status);
    }

    if (language) {
      query = query.whereRaw('guides.languages @> ?', [JSON.stringify([language])]);
    }

    const guides = await query.orderBy('guides.created_at', 'desc');

    res.json(guides);
  } catch (error) {
    throw new AppError('Failed to fetch guides', 500);
  }
};

export const getGuideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const guide = await db('guides')
      .select('guides.*', 'users.email', 'users.phone')
      .leftJoin('users', 'guides.user_id', 'users.id')
      .where('guides.id', id)
      .first();

    if (!guide) {
      throw new AppError('Guide not found', 404);
    }

    // Get stats
    const stats = await db('bookings')
      .count('* as total_bookings')
      .where({ guide_id: id, status: 'completed' })
      .first();

    res.json({ ...guide, stats });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch guide', 500);
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.user_id;
    delete updates.rating;

    const guide = await db('guides').where({ user_id: userId }).first();

    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const [updatedGuide] = await db('guides')
      .where({ user_id: userId })
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');

    res.json(updatedGuide);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update profile', 500);
  }
};

export const getGuideStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    // Total bookings
    const totalBookings = await db('bookings')
      .count('* as count')
      .where({ guide_id: guide.id })
      .first();

    // Completed tours
    const completedTours = await db('bookings')
      .count('* as count')
      .where({ guide_id: guide.id, status: 'completed' })
      .first();

    // Upcoming tours
    const upcomingTours = await db('bookings')
      .count('* as count')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .where({ 'bookings.guide_id': guide.id, 'bookings.status': 'confirmed' })
      .where('slots.start_datetime', '>', db.fn.now())
      .first();

    // Total earnings
    const earnings = await db('payouts')
      .sum('amount as total')
      .where({ guide_id: guide.id, status: 'paid' })
      .first();

    res.json({
      guide_id: guide.id,
      full_name: guide.full_name,
      rating: guide.rating,
      total_bookings: parseInt(totalBookings?.count as string || '0'),
      completed_tours: parseInt(completedTours?.count as string || '0'),
      upcoming_tours: parseInt(upcomingTours?.count as string || '0'),
      total_earnings: parseFloat(earnings?.total || '0')
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch stats', 500);
  }
};
