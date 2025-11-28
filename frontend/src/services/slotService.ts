import api from './api';
import { Slot } from '../types';

export const slotService = {
  getSlots: async (params?: {
    from?: string;
    to?: string;
    language?: string;
    status?: string;
  }): Promise<Slot[]> => {
    const response = await api.get('/slots', { params });
    return response.data;
  },

  getSlotById: async (id: number): Promise<Slot> => {
    const response = await api.get(`/slots/${id}`);
    return response.data;
  },

  createSlot: async (data: Partial<Slot>): Promise<Slot> => {
    const response = await api.post('/slots', data);
    return response.data;
  },

  updateSlot: async (id: number, data: Partial<Slot>): Promise<Slot> => {
    const response = await api.put(`/slots/${id}`, data);
    return response.data;
  },

  deleteSlot: async (id: number): Promise<void> => {
    await api.delete(`/slots/${id}`);
  }
};
