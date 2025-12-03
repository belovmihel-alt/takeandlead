import { useState } from 'react';

function Profile() {
  const [user] = useState({
    name: 'Алексей Г.',
    fullName: 'Алексеев Георгий Михайлович',
    role: 'Экскурсовод PRO',
    rating: 4.8,
    level: 'Профессионал',
    toursCount: 78,
    earnings: 142500,
    phone: '+7 (919) 628-XX-XX',
    email: 'alexey.g@museum.rt.ru',
    languages: ['Русский', 'English', 'Татарский'],
    specializations: ['История', 'Искусство', 'Архитектура'],
    workingSince: 'Ноябрь 2024',
    inn: '1655XXXXXXXX'
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="page">
      <div className="profile-header">
        <div className="profile-avatar">
          {getInitials(user.name)}
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-role">{user.role}</div>
      </div>

      <div className="card">
        <h3 className="card-title">Личная информация</h3>
        <div className="profile-section">
          <div className="profile-row">
            <span className="profile-label">Полное имя</span>
            <span className="profile-value">{user.fullName}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Телефон</span>
            <span className="profile-value">{user.phone}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Email</span>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">ИНН</span>
            <span className="profile-value">{user.inn}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Статистика</h3>
        <div className="profile-section">
          <div className="profile-row">
            <span className="profile-label">Уровень</span>
            <span className="profile-value">{user.level}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Рейтинг</span>
            <span className="profile-value">⭐ {user.rating}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Экскурсий</span>
            <span className="profile-value">{user.toursCount}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Заработок</span>
            <span className="profile-value" style={{ color: '#10b981' }}>
              {user.earnings.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="profile-row">
            <span className="profile-label">В системе с</span>
            <span className="profile-value">{user.workingSince}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Языки</h3>
        <div className="profile-tags">
          {user.languages.map((lang, index) => (
            <span key={index} className="tag">{lang}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Специализации</h3>
        <div className="profile-tags">
          {user.specializations.map((spec, index) => (
            <span key={index} className="tag">{spec}</span>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 className="card-title">Документы</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px' }}>📄 Договор самозанятого</span>
            <span style={{ fontSize: '12px', color: '#10b981' }}>✓ Подписан</span>
          </div>
          <div style={{
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px' }}>🎓 Сертификат экскурсовода</span>
            <span style={{ fontSize: '12px', color: '#10b981' }}>✓ Подтвержден</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
