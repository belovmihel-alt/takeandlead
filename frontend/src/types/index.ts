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

export interface User {
  id: number;
  email: string;
  phone?: string;
  role: UserRole;
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
}

export interface Slot {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  duration_min: number;
  language: string;
  hall?: string;
  capacity?: number;
  base_fee: number;
  bonus_json?: Record<string, any>;
  requires_approval: boolean;
  status: SlotStatus;
  created_at: string;
}

export interface Booking {
  id: number;
  slot_id: number;
  guide_id: number;
  status: BookingStatus;
  booked_at: string;
  confirmed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  title?: string;
  start_datetime?: string;
  end_datetime?: string;
  hall?: string;
  base_fee?: number;
}

export interface Stats {
  total_bookings: number;
  completed_tours: number;
  upcoming_tours: number;
  total_earnings: number;
}

export interface QRCode {
  token: string;
  qr_image_url: string;
  expires_at: string;
}
