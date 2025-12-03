import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const MOCK_SLOTS = [
  {
    id: 1,
    date: '15 мая',
    time: '10:00',
    title: 'Обзорная Экскурсия',
    hall: 'Основная экспозиция',
    group: '20 чел',
    fee: 2500,
    language: 'Русский'
  },
  {
    id: 2,
    date: '15 мая',
    time: '12:00',
    title: 'Искусство XX века',
    hall: 'Зал современного искусства',
    group: '15 чел',
    fee: 3000,
    language: 'Русский'
  },
  {
    id: 3,
    date: '16 мая',
    time: '14:30',
    title: 'Исторический Зал',
    hall: 'Зал истории Татарстана',
    group: '25 чел',
    fee: 3500,
    language: 'Татарский'
  }
];

function Slots() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef(null);

  const generateQR = async (slotId) => {
    const qrData = JSON.stringify({
      guide_id: 142,
      slot_id: slotId,
      booking_id: Math.floor(Math.random() * 10000) + 2910,
      timestamp: new Date().toISOString(),
      museum: 'Национальный музей РТ'
    });

    try {
      const url = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0369a1',
          light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    generateQR(slot.id);
  };

  const closeModal = () => {
    setSelectedSlot(null);
    setQrDataUrl('');
  };

  const currentMonth = 'Май';
  const daysInMonth = [
    { day: 26, hasSlots: false, disabled: true },
    { day: 27, hasSlots: false, disabled: true },
    { day: 8, hasSlots: false, disabled: true },
    { day: 9, hasSlots: false, disabled: true },
    { day: 10, hasSlots: false },
    { day: 11, hasSlots: false },
    { day: 12, hasSlots: false },
    { day: 13, hasSlots: false },
    { day: 14, hasSlots: false },
    { day: 15, hasSlots: true, isToday: true },
    { day: 16, hasSlots: true },
    { day: 17, hasSlots: false },
    { day: 18, hasSlots: false },
    { day: 19, hasSlots: false }
  ];

  return (
    <div className="page">
      <h1 className="page-title">Расписание</h1>

      <div className="calendar">
        <div className="calendar-header">
          <button className="calendar-nav">‹</button>
          <div className="calendar-month">{currentMonth}</div>
          <button className="calendar-nav">›</button>
        </div>

        <div className="calendar-days">
          {daysInMonth.map((item, index) => (
            <button
              key={index}
              className={`calendar-day ${item.disabled ? 'disabled' : ''} ${item.isToday ? 'today' : ''} ${item.hasSlots ? 'has-slots' : ''}`}
              disabled={item.disabled}
            >
              {item.day}
            </button>
          ))}
        </div>
      </div>

      <div className="slot-list">
        {MOCK_SLOTS.map((slot) => (
          <div
            key={slot.id}
            className="slot-card"
            onClick={() => handleSlotClick(slot)}
          >
            <div className="slot-header">
              <div className="slot-time">{slot.date}, {slot.time}</div>
              <div className="slot-fee">{slot.fee} ₽</div>
            </div>
            <div className="slot-title">{slot.title}</div>
            <div className="slot-info">
              <span>👥 {slot.group}</span>
              <span>📍 {slot.hall}</span>
              <span>🌐 {slot.language}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Активный слот</h2>
            <p className="modal-subtitle">Национальный музей РТ</p>

            {qrDataUrl && (
              <div style={{ marginBottom: '20px' }}>
                <div className="qr-container">
                  <img src={qrDataUrl} alt="QR Code" style={{ display: 'block' }} />
                </div>
              </div>
            )}

            <div className="qr-info">
              <div className="qr-info-row">
                <span className="qr-info-label">ID:</span>
                <span className="qr-info-value">8493-{selectedSlot.id}910</span>
              </div>
              <div className="qr-info-row">
                <span className="qr-info-label">Дата:</span>
                <span className="qr-info-value">{selectedSlot.date}, {selectedSlot.time}</span>
              </div>
              <div className="qr-info-row">
                <span className="qr-info-label">Группа:</span>
                <span className="qr-info-value">№{142 + selectedSlot.id} ({selectedSlot.group})</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={closeModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Slots;
