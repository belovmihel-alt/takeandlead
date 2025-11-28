import { Request, Response } from 'express';
import QRCode from 'qrcode';
import db from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateQRToken, verifyQRToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { AttendanceStatus, BookingStatus } from '../types';

export const getMyQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get guide
    const guide = await db('guides').where({ user_id: userId }).first();
    if (!guide) {
      throw new AppError('Guide profile not found', 404);
    }

    // Generate QR token
    const token = generateQRToken(guide.id);

    // Save token to database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db('qr_tokens').insert({
      guide_id: guide.id,
      token,
      expires_at: expiresAt
    });

    // Generate QR code image
    const qrImageUrl = await QRCode.toDataURL(token);

    res.json({
      token,
      qr_image_url: qrImageUrl,
      expires_at: expiresAt
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to generate QR code', 500);
  }
};

export const scanQRCode = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    const scannerId = req.user!.userId;

    // Verify QR token
    let decoded;
    try {
      decoded = verifyQRToken(token);
    } catch (error) {
      throw new AppError('Invalid or expired QR code', 400);
    }

    const guideId = decoded.guide_id;

    // Check if token is revoked
    const qrToken = await db('qr_tokens')
      .where({ token })
      .first();

    if (!qrToken || qrToken.revoked) {
      throw new AppError('QR code has been revoked', 400);
    }

    // Find current booking for this guide (within +/- 30 minutes)
    const now = new Date();
    const timeWindow = 30 * 60 * 1000; // 30 minutes in ms

    const booking = await db('bookings')
      .select('bookings.*', 'slots.start_datetime', 'slots.end_datetime')
      .leftJoin('slots', 'bookings.slot_id', 'slots.id')
      .where({ 'bookings.guide_id': guideId, 'bookings.status': BookingStatus.CONFIRMED })
      .whereBetween('slots.start_datetime', [
        new Date(now.getTime() - timeWindow),
        new Date(now.getTime() + timeWindow)
      ])
      .first();

    if (!booking) {
      throw new AppError('No scheduled booking found for this guide at this time', 404);
    }

    // Check if already scanned
    const existingAttendance = await db('attendance')
      .where({ booking_id: booking.id, status: AttendanceStatus.ARRIVED })
      .first();

    if (existingAttendance) {
      throw new AppError('Guide has already checked in', 400);
    }

    // Create attendance record
    const [attendance] = await db('attendance')
      .insert({
        booking_id: booking.id,
        scanner_id: scannerId,
        status: AttendanceStatus.ARRIVED
      })
      .returning('*');

    // Log action
    await db('audit_logs').insert({
      user_id: scannerId,
      action: 'qr_scanned',
      meta: JSON.stringify({ guide_id: guideId, booking_id: booking.id })
    });

    res.json({
      message: 'Check-in successful',
      attendance,
      booking
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to scan QR code', 500);
  }
};
