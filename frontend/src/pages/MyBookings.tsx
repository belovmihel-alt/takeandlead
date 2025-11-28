import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(id, 'Отменено пользователем');
      toast.success('Бронирование отменено');
      loadBookings();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка отмены');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const badges = {
      [BookingStatus.REQUESTED]: 'bg-yellow-100 text-yellow-800',
      [BookingStatus.CONFIRMED]: 'bg-green-100 text-green-800',
      [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [BookingStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
      [BookingStatus.NO_SHOW]: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      [BookingStatus.REQUESTED]: 'Ожидает подтверждения',
      [BookingStatus.CONFIRMED]: 'Подтверждено',
      [BookingStatus.CANCELLED]: 'Отменено',
      [BookingStatus.COMPLETED]: 'Завершено',
      [BookingStatus.NO_SHOW]: 'Не явился'
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои бронирования</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">У вас пока нет бронирований</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.title}
                        </h3>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex space-x-4">
                            <p className="flex items-center text-sm text-gray-500">
                              {booking.start_datetime &&
                                format(new Date(booking.start_datetime), 'dd MMM yyyy, HH:mm', {
                                  locale: ru
                                })}
                            </p>
                            {booking.hall && (
                              <p className="flex items-center text-sm text-gray-500">
                                Зал: {booking.hall}
                              </p>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {booking.base_fee && (
                              <span className="font-medium text-green-600">
                                {booking.base_fee} ₽
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-2">
                        {getStatusBadge(booking.status)}
                        {(booking.status === BookingStatus.REQUESTED ||
                          booking.status === BookingStatus.CONFIRMED) && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
