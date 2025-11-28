import api from './api';
import { Guide, Stats } from '../types';

export const guideService = {
  getMyStats: async (): Promise<Stats> => {
    const response = await api.get('/guides/my/stats');
    return response.data;
  },

  updateMyProfile: async (data: Partial<Guide>): Promise<Guide> => {
    const response = await api.put('/guides/my/profile', data);
    return response.data;
  },

  getMyEarnings: async (): Promise<any> => {
    const response = await api.get('/payouts/my/earnings');
    return response.data;
  }
};
