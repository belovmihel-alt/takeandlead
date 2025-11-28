export enum UserRole {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  GUIDE = 'guide'
}

export enum BookingStatus {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show'
}

export enum SlotStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum AttendanceStatus {
  ARRIVED = 'arrived',
  LEFT = 'left'
}

export enum PayoutStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled'
}

export interface User {
  id: number;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  last_login?: Date;
}

export interface Guide {
  id: number;
  user_id: number;
  full_name: string;
  photo_url?: string;
  inn?: string;
  bio?: string;
  languages: string[];
  tags: string[];
  rating: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Slot {
  id: number;
  title: string;
  description?: string;
  start_datetime: Date;
  end_datetime: Date;
  duration_min: number;
  language: string;
  hall?: string;
  capacity?: number;
  base_fee: number;
  bonus_json?: Record<string, any>;
  requires_approval: boolean;
  created_by: number;
  status: SlotStatus;
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: number;
  slot_id: number;
  guide_id: number;
  status: BookingStatus;
  booked_at: Date;
  confirmed_at?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
}

export interface Attendance {
  id: number;
  booking_id: number;
  scanner_id: number;
  scanned_at: Date;
  status: AttendanceStatus;
}

export interface QRToken {
  id: number;
  guide_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  revoked: boolean;
}

export interface Payout {
  id: number;
  guide_id: number;
  booking_id?: number;
  amount: number;
  type: string;
  status: PayoutStatus;
  period_from?: Date;
  period_to?: Date;
  created_at: Date;
  paid_at?: Date;
}

export interface MotivationConfig {
  base_fee: number;
  coefficients: {
    weekend?: number;
    foreign_lang?: number;
    thematic?: number;
    late_booking_bonus?: number;
    [key: string]: number | undefined;
  };
  achievements?: Array<{
    name: string;
    reward: number;
    type: string;
  }>;
}
