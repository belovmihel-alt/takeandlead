import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { guideService } from '../services/guideService';
import { Stats } from '../types';

export default function GuideDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, earningsData] = await Promise.all([
        guideService.getMyStats(),
        guideService.getMyEarnings()
      ]);
      setStats(statsData);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Личный кабинет</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Всего бронирований
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.total_bookings || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Завершенные экскурсии
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.completed_tours || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Предстоящие экскурсии
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {stats?.upcoming_tours || 0}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Общий заработок
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {earnings?.total_earnings?.toFixed(2) || 0} ₽
              </dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/slots"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Просмотреть таймслоты
            </Link>
            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Мои бронирования
            </Link>
            <Link
              to="/qr-pass"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Получить QR-пропуск
            </Link>
          </div>
        </div>

        {/* Rating Section */}
        {stats && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Рейтинг</h2>
            <div className="flex items-center">
              <div className="text-4xl font-bold text-yellow-500">{stats.rating || 0}</div>
              <div className="ml-3 text-gray-500">из 5.0</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
