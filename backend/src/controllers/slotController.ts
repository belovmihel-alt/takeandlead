import { Request, Response } from 'express';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { SlotStatus, UserRole } from '../types';
import { AuthRequest } from '../middleware/auth';

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { from, to, language, status, hall } = req.query;

    let query = db('slots').select('*');

    if (from) {
      query = query.where('start_datetime', '>=', from);
    }
    if (to) {
      query = query.where('end_datetime', '<=', to);
    }
    if (language) {
      query = query.where('language', language);
    }
    if (status) {
      query = query.where('status', status);
    }
    if (hall) {
      query = query.where('hall', hall);
    }

    const slots = await query.orderBy('start_datetime', 'asc');

    res.json(slots);
  } catch (error) {
    throw new AppError('Failed to fetch slots', 500);
  }
};

export const getSlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const slot = await db('slots').where({ id }).first();

    if (!slot) {
      throw new AppError('Slot not found', 404);
    }

    // Get booking info if exists
    const booking = await db('bookings')
      .where({ slot_id: id })
      .whereIn('status', ['confirmed', 'requested'])
      .first();

    res.json({ ...slot, booking });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch slot', 500);
  }
};

export const createSlot = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      start_datetime,
      end_datetime,
      duration_min,
      language,
      hall,
      capacity,
      base_fee,
      bonus_json,
      requires_approval
    } = req.body;

    const [slot] = await db('slots')
      .insert({
        title,
        description,
        start_datetime,
        end_datetime,
        duration_min,
        language: language || 'ru',
        hall,
        capacity: capacity || 1,
        base_fee,
        bonus_json: bonus_json ? JSON.stringify(bonus_json) : null,
        requires_approval: requires_approval || false,
        created_by: req.user!.userId,
        status: SlotStatus.OPEN
      })
      .returning('*');

    // Log action
    await db('audit_logs').insert({
      user_id: req.user!.userId,
      action: 'slot_created',
      meta: JSON.stringify({ slot_id: typeof slot === 'object' ? slot.id : slot })
    });

    res.status(201).json(slot);
  } catch (error) {
    throw new AppError('Failed to create slot', 500);
  }
};

export const updateSlot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_by;
    delete updates.created_at;

    const [updatedSlot] = await db('slots')
      .where({ id })
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');

    if (!updatedSlot) {
      throw new AppError('Slot not found', 404);
    }

    res.json(updatedSlot);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to update slot', 500);
  }
};

export const deleteSlot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if slot has bookings
    const booking = await db('bookings')
      .where({ slot_id: id })
      .whereIn('status', ['confirmed', 'requested'])
      .first();

    if (booking) {
      throw new AppError('Cannot delete slot with active bookings', 400);
    }

    await db('slots').where({ id }).delete();

    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to delete slot', 500);
  }
};
