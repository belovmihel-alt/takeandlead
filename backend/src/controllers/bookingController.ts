import { Request, Response } from 'express';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { BookingStatus, SlotStatus } from '../types';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { slot_id } = req.body;
    const userId = req.user!.userId;

    // Get guide ID
    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    // Check if slot exists and is available
    const slot = await db('slots').where({ id: slot_id }).first();
    if (!slot) {
      throw new AppError('Slot not found', 404);
    }

    if (slot.status !== SlotStatus.OPEN) {
      throw new AppError('Slot is not available for booking', 400);
    }

    // Check for existing booking
    const existingBooking = await db('bookings')
      .where({ slot_id, guide_id: guide.id })
      .whereIn('status', ['requested', 'confirmed'])
      .first();

    if (existingBooking) {
      throw new AppError('You have already booked this slot', 400);
    }

    // Create booking
    const status = slot.requires_approval ? BookingStatus.REQUESTED : BookingStatus.CONFIRMED;

    const [booking] = await db('bookings')
      .insert({
        slot_id,
        guide_id: guide.id,
        status,
        confirmed_at: status === BookingStatus.CONFIRMED ? db.fn.now() : null
      })
      .returning('*');

    // Update slot status if auto-confirmed
    if (status === BookingStatus.CONFIRMED) {
      await db('slots').where({ id: slot_id }).update({ status: SlotStatus.ASSIGNED });
    }

    // Log action
    await db('audit_logs').insert({
      user_id: userId,
      action: 'booking_created',
      meta: JSON.stringify({ booking_id: typeof booking === 'object' ? booking.id : booking, slot_id })
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create booking', 500);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const bookings = await db('bookings')
      .select('bookings.*', 'slots.title', 'slots.start_datetime', 'slots.end_datetime', 'slots.hall', 'slots.base_fee')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .where({ 'bookings.guide_id': guide.id })
      .orderBy('slots.start_datetime', 'desc');

    res.json(bookings);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch bookings', 500);
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user!.userId;

    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    const booking = await db('bookings').where({ id, guide_id: guide.id }).first();
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new AppError('Booking is already cancelled', 400);
    }

    // Update booking
    await db('bookings')
      .where({ id })
      .update({
        status: BookingStatus.CANCELLED,
        cancelled_at: db.fn.now(),
        cancellation_reason: reason
      });

    // Update slot status back to open
    await db('slots').where({ id: booking.slot_id }).update({ status: SlotStatus.OPEN });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to cancel booking', 500);
  }
};

export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await db('bookings').where({ id }).first();
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new AppError('Booking is not in requested status', 400);
    }

    await db('bookings')
      .where({ id })
      .update({
        status: BookingStatus.CONFIRMED,
        confirmed_at: db.fn.now()
      });

    // Update slot status
    await db('slots').where({ id: booking.slot_id }).update({ status: SlotStatus.ASSIGNED });

    res.json({ message: 'Booking confirmed successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to confirm booking', 500);
  }
};
