import { useEffect, useState } from 'react';

function Statistics() {
  const [stats] = useState({
    totalTours: Math.floor(Math.random() * 50) + 30,
    completedTours: Math.floor(Math.random() * 40) + 25,
    upcomingTours: Math.floor(Math.random() * 5) + 2,
    totalEarnings: (Math.floor(Math.random() * 50000) + 20000),
    rating: (Math.random() * 1 + 4).toFixed(1),
    level: 'Профессионал',
    levelProgress: Math.floor(Math.random() * 40) + 60,
    nextLevel: 'Мастер',
    toursToNextLevel: Math.floor(Math.random() * 10) + 5
  });

  const formatMoney = (amount) => {
    return amount.toLocaleString('ru-RU');
  };

  return (
    <div className="page">
      <h1 className="page-title">Статистика</h1>

      <div className="card level-card">
        <div className="level-badge">Текущий уровень</div>
        <div className="level-title">{stats.level}</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${stats.levelProgress}%` }}></div>
        </div>
        <div className="progress-text">
          До уровня "{stats.nextLevel}" осталось {stats.toursToNextLevel} экскурсий
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Общая статистика</h3>
        <div className="stat-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.totalTours}</div>
            <div className="stat-label">Всего экскурсий</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.completedTours}</div>
            <div className="stat-label">Завершено</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.upcomingTours}</div>
            <div className="stat-label">Предстоящих</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.rating}</div>
            <div className="stat-label">Рейтинг</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Заработок</h3>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
            {formatMoney(stats.totalEarnings)} ₽
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>Общий заработок за все время</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Достижения</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f0fdf4',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px' }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Первые 10 экскурсий</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Бонус: +1,000 ₽</div>
            </div>
            <div style={{ color: '#10b981', fontWeight: '600' }}>✓</div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f0fdf4',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px' }}>⭐</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Отличный старт</div>
              <div style={{ fontSize: '13px', color: '#666' }}>25 экскурсий проведено</div>
            </div>
            <div style={{ color: '#10b981', fontWeight: '600' }}>✓</div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '12px',
            opacity: '0.6'
          }}>
            <div style={{ fontSize: '32px' }}>💎</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>Золотой гид</div>
              <div style={{ fontSize: '13px', color: '#666' }}>50 экскурсий (осталось {50 - stats.completedTours})</div>
            </div>
            <div style={{ color: '#999' }}>○</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
