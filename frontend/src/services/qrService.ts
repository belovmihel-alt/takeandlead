import api from './api';
import { QRCode } from '../types';

export const qrService = {
  getMyQRCode: async (): Promise<QRCode> => {
    const response = await api.get('/qr/my');
    return response.data;
  },

  scanQRCode: async (token: string): Promise<any> => {
    const response = await api.post('/qr/scan', { token });
    return response.data;
  }
};
