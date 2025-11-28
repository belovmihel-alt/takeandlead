import jwt from 'jsonwebtoken';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateQRToken = (guideId: number): string => {
  const QR_SECRET = process.env.QR_SECRET || 'qr-secret-key';
  const payload = {
    guide_id: guideId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
    nonce: Math.random().toString(36).substring(2),
    scope: 'entry'
  };

  return jwt.sign(payload, QR_SECRET);
};

export const verifyQRToken = (token: string): any => {
  const QR_SECRET = process.env.QR_SECRET || 'qr-secret-key';
  try {
    return jwt.verify(token, QR_SECRET);
  } catch (error) {
    throw new Error('Invalid QR token');
  }
};
