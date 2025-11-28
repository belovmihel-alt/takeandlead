import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { slotService } from '../services/slotService';
import { bookingService } from '../services/bookingService';
import { Slot, SlotStatus } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function Slots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ language: '', status: 'open' });

  useEffect(() => {
    loadSlots();
  }, [filter]);

  const loadSlots = async () => {
    try {
      const data = await slotService.getSlots(filter);
      setSlots(data);
    } catch (error) {
      toast.error('Ошибка загрузки таймслотов');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (slotId: number) => {
    try {
      await bookingService.createBooking(slotId);
      toast.success('Слот успешно забронирован');
      loadSlots();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка бронирования');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Загрузка...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Доступные таймслоты</h1>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Язык
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filter.language}
                onChange={(e) => setFilter({ ...filter, language: e.target.value })}
              >
                <option value="">Все</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="tt">Татарский</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="open">Открыто</option>
                <option value="">Все</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slots.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Нет доступных таймслотов
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {slot.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{slot.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Дата:</span>
                      <span className="font-medium">
                        {format(new Date(slot.start_datetime), 'dd MMM yyyy', { locale: ru })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Время:</span>
                      <span className="font-medium">
                        {format(new Date(slot.start_datetime), 'HH:mm')} -{' '}
                        {format(new Date(slot.end_datetime), 'HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Зал:</span>
                      <span className="font-medium">{slot.hall || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Оплата:</span>
                      <span className="font-medium text-green-600">
                        {slot.base_fee} ₽
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {slot.status === SlotStatus.OPEN ? (
                      <button
                        onClick={() => handleBook(slot.id)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Забронировать
                      </button>
                    ) : (
                      <div className="text-center text-sm text-gray-500">
                        {slot.status === SlotStatus.ASSIGNED && 'Занято'}
                        {slot.status === SlotStatus.CLOSED && 'Закрыто'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
