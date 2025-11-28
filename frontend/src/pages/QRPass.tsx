import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { qrService } from '../services/qrService';
import { QRCode } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function QRPass() {
  const [qrData, setQrData] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(false);

  const loadQRCode = async () => {
    setLoading(true);
    try {
      const data = await qrService.getMyQRCode();
      setQrData(data);
      toast.success('QR-пропуск сгенерирован');
    } catch (error) {
      toast.error('Ошибка генерации QR-кода');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQRCode();
  }, []);

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR-пропуск</h1>

        <div className="bg-white shadow rounded-lg p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ваш пропуск для входа в музей
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Покажите этот QR-код на входе в музей для прохода
            </p>

            {loading ? (
              <div className="py-12">Генерация QR-кода...</div>
            ) : qrData ? (
              <>
                <div className="flex justify-center mb-6">
                  <img
                    src={qrData.qr_image_url}
                    alt="QR Code"
                    className="w-64 h-64 border-4 border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Действителен до:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(qrData.expires_at), 'dd MMM yyyy, HH:mm', {
                        locale: ru
                      })}
                    </p>
                  </div>

                  <button
                    onClick={loadQRCode}
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Обновить QR-код
                  </button>

                  <div className="mt-6 text-left">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Инструкция:
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li>Покажите QR-код на входе в музей</li>
                      <li>Сотрудник отсканирует код</li>
                      <li>После сканирования вам будет разрешен проход</li>
                      <li>QR-код действителен в течение 24 часов</li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500">Не удалось загрузить QR-код</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
