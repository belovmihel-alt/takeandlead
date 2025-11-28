import api from './api';
import { Booking } from '../types';

export const bookingService = {
  createBooking: async (slot_id: number): Promise<Booking> => {
    const response = await api.post('/bookings', { slot_id });
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  cancelBooking: async (id: number, reason?: string): Promise<void> => {
    await api.post(`/bookings/${id}/cancel`, { reason });
  },

  confirmBooking: async (id: number): Promise<void> => {
    await api.post(`/bookings/${id}/confirm`);
  }
};
