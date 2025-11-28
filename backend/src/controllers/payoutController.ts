import { Request, Response } from 'express';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { BookingStatus, PayoutStatus } from '../types';

// Get motivation config from database or use default
const getMotivationConfig = async () => {
  const campaign = await db('admin_campaigns')
    .where({ active: true })
    .first();

  if (campaign && campaign.rules) {
    return campaign.rules;
  }

  // Default config
  return {
    base_fee: 1000,
    coefficients: {
      weekend: 1.3,
      foreign_lang: 1.5,
      thematic: 1.2,
      late_booking_bonus: 200
    }
  };
};

const calculatePayout = async (booking: any, slot: any) => {
  const config = await getMotivationConfig();

  let amount = parseFloat(slot.base_fee);
  const bonuses: string[] = [];

  // Check for weekend
  const slotDate = new Date(slot.start_datetime);
  const dayOfWeek = slotDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    amount *= config.coefficients.weekend || 1;
    bonuses.push('weekend');
  }

  // Check for foreign language
  if (slot.language && slot.language !== 'ru') {
    amount *= config.coefficients.foreign_lang || 1;
    bonuses.push('foreign_language');
  }

  // Add custom bonuses from slot
  if (slot.bonus_json) {
    const slotBonuses = typeof slot.bonus_json === 'string'
      ? JSON.parse(slot.bonus_json)
      : slot.bonus_json;

    if (slotBonuses.amount) {
      amount += parseFloat(slotBonuses.amount);
    }
  }

  return { amount: Math.round(amount * 100) / 100, bonuses };
};

export const getMyEarnings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    // Get all completed bookings
    const completedBookings = await db('bookings')
      .select('bookings.*', 'slots.*')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .where({ 'bookings.guide_id': guide.id, 'bookings.status': BookingStatus.COMPLETED })
      .orderBy('slots.start_datetime', 'desc');

    // Calculate earnings for each booking
    const earnings = await Promise.all(
      completedBookings.map(async (booking) => {
        const { amount, bonuses } = await calculatePayout(booking, booking);

        return {
          booking_id: booking.id,
          slot_title: booking.title,
          date: booking.start_datetime,
          base_fee: booking.base_fee,
          calculated_amount: amount,
          bonuses,
          payout_status: 'pending'
        };
      })
    );

    // Get total stats
    const totalEarnings = earnings.reduce((sum, e) => sum + e.calculated_amount, 0);
    const totalBookings = completedBookings.length;

    res.json({
      guide_id: guide.id,
      total_earnings: Math.round(totalEarnings * 100) / 100,
      total_completed_bookings: totalBookings,
      earnings
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to calculate earnings', 500);
  }
};

export const createPayout = async (req: AuthRequest, res: Response) => {
  try {
    const { guide_id, booking_ids, period_from, period_to } = req.body;

    // Get bookings
    const bookings = await db('bookings')
      .select('bookings.*', 'slots.*')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .where({ 'bookings.guide_id': guide_id })
      .whereIn('bookings.id', booking_ids)
      .where({ 'bookings.status': BookingStatus.COMPLETED });

    if (bookings.length === 0) {
      throw new AppError('No valid bookings found', 404);
    }

    // Calculate total amount
    let totalAmount = 0;
    const payoutDetails = [];

    for (const booking of bookings) {
      const { amount } = await calculatePayout(booking, booking);
      totalAmount += amount;
      payoutDetails.push({
        booking_id: booking.id,
        amount
      });
    }

    // Create payout record
    const [payout] = await db('payouts')
      .insert({
        guide_id,
        amount: Math.round(totalAmount * 100) / 100,
        type: 'fee',
        status: PayoutStatus.PENDING,
        period_from,
        period_to
      })
      .returning('*');

    res.status(201).json({
      payout,
      details: payoutDetails,
      total_amount: Math.round(totalAmount * 100) / 100
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create payout', 500);
  }
};

export const markPayoutAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [payout] = await db('payouts')
      .where({ id })
      .update({
        status: PayoutStatus.PAID,
        paid_at: db.fn.now()
      })
      .returning('*');

    if (!payout) {
      throw new AppError('Payout not found', 404);
    }

    res.json(payout);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to mark payout as paid', 500);
  }
};
