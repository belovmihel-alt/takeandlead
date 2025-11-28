# API Documentation

## Базовый URL

```
http://localhost:5000/api
```

## Аутентификация

Все защищенные эндпойнты требуют JWT токен в заголовке:

```
Authorization: Bearer <token>
```

## Эндпойнты

### Аутентификация

#### POST /auth/register
Регистрация нового пользователя

**Request Body:**
```json
{
  "email": "guide@example.com",
  "phone": "+79001234567",
  "password": "password123",
  "full_name": "Иванов Иван Иванович"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "guide@example.com",
    "role": "guide"
  }
}
```

#### POST /auth/login
Вход в систему

**Request Body:**
```json
{
  "email": "guide@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "guide@example.com",
    "role": "guide"
  }
}
```

#### GET /auth/profile
Получить профиль текущего пользователя (требует авторизации)

**Response:**
```json
{
  "id": 1,
  "email": "guide@example.com",
  "phone": "+79001234567",
  "role": "guide",
  "guide": {
    "id": 1,
    "full_name": "Иванов Иван Иванович",
    "rating": 4.5,
    "languages": ["ru", "en"]
  }
}
```

### Таймслоты

#### GET /slots
Получить список таймслотов

**Query Parameters:**
- `from` - дата начала (ISO 8601)
- `to` - дата окончания (ISO 8601)
- `language` - язык (ru, en, tt)
- `status` - статус (open, assigned, closed, cancelled)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Экскурсия по основной экспозиции",
    "description": "Обзорная экскурсия",
    "start_datetime": "2025-01-15T10:00:00Z",
    "end_datetime": "2025-01-15T11:30:00Z",
    "duration_min": 90,
    "language": "ru",
    "hall": "Зал 1",
    "base_fee": 1500,
    "status": "open"
  }
]
```

#### POST /slots
Создать таймслот (admin/coordinator)

**Request Body:**
```json
{
  "title": "Экскурсия по основной экспозиции",
  "description": "Обзорная экскурсия",
  "start_datetime": "2025-01-15T10:00:00Z",
  "end_datetime": "2025-01-15T11:30:00Z",
  "duration_min": 90,
  "language": "ru",
  "hall": "Зал 1",
  "base_fee": 1500,
  "requires_approval": false
}
```

### Бронирования

#### POST /bookings
Забронировать таймслот (guide)

**Request Body:**
```json
{
  "slot_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "slot_id": 1,
  "guide_id": 1,
  "status": "confirmed",
  "booked_at": "2025-01-10T12:00:00Z"
}
```

#### GET /bookings/my
Получить свои бронирования (guide)

**Response:**
```json
[
  {
    "id": 1,
    "slot_id": 1,
    "guide_id": 1,
    "status": "confirmed",
    "booked_at": "2025-01-10T12:00:00Z",
    "title": "Экскурсия по основной экспозиции",
    "start_datetime": "2025-01-15T10:00:00Z"
  }
]
```

#### POST /bookings/:id/cancel
Отменить бронирование (guide)

**Request Body:**
```json
{
  "reason": "Не смогу прийти"
}
```

### QR-пропуска

#### GET /qr/my
Получить свой QR-код (guide)

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "qr_image_url": "data:image/png;base64,...",
  "expires_at": "2025-01-11T12:00:00Z"
}
```

#### POST /qr/scan
Сканировать QR-код (admin/coordinator)

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Check-in successful",
  "attendance": {
    "id": 1,
    "booking_id": 1,
    "scanner_id": 2,
    "scanned_at": "2025-01-15T09:55:00Z",
    "status": "arrived"
  }
}
```

### Выплаты

#### GET /payouts/my/earnings
Получить свои заработки (guide)

**Response:**
```json
{
  "guide_id": 1,
  "total_earnings": 15000,
  "total_completed_bookings": 10,
  "earnings": [
    {
      "booking_id": 1,
      "slot_title": "Экскурсия по основной экспозиции",
      "date": "2025-01-15T10:00:00Z",
      "base_fee": 1500,
      "calculated_amount": 1950,
      "bonuses": ["weekend"],
      "payout_status": "pending"
    }
  ]
}
```

### Статистика

#### GET /guides/my/stats
Получить свою статистику (guide)

**Response:**
```json
{
  "guide_id": 1,
  "full_name": "Иванов Иван Иванович",
  "rating": 4.5,
  "total_bookings": 25,
  "completed_tours": 20,
  "upcoming_tours": 3,
  "total_earnings": 30000
}
```

## Коды ошибок

- `400` - Bad Request (неверные данные)
- `401` - Unauthorized (не авторизован)
- `403` - Forbidden (нет прав доступа)
- `404` - Not Found (ресурс не найден)
- `500` - Internal Server Error (ошибка сервера)

## Примеры ошибок

```json
{
  "error": "Invalid credentials"
}
```

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```
