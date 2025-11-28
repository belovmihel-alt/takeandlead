# Система бронирования и мотивации экскурсоводов
## Национальный музей Республики Татарстан

Полнофункциональная веб-система для управления внештатными экскурсоводами (самозанятыми) с возможностями бронирования таймслотов, генерации QR-пропусков, учета статистики и системой финансовой мотивации.

## Возможности

### Для экскурсоводов:
- Регистрация и профиль
- Просмотр доступных таймслотов экскурсий
- Бронирование таймслотов
- Генерация QR-пропуска для входа в музей
- Просмотр статистики (завершенные экскурсии, рейтинг, заработок)
- Отслеживание своих бронирований
- Просмотр системы мотивации и начисленных бонусов

### Для администраторов/координаторов:
- Создание и управление таймслотами
- Просмотр всех бронирований
- Подтверждение бронирований (если требуется)
- Сканирование QR-кодов и фиксация прихода экскурсоводов
- Просмотр базы данных экскурсоводов
- Настройка системы мотивации
- Управление выплатами
- Аналитика и отчеты
- Просмотр логов аудита

## Технологический стек

### Backend:
- **Node.js** + **Express** - серверный фреймворк
- **TypeScript** - типизированный JavaScript
- **PostgreSQL** - реляционная база данных
- **Knex.js** - SQL query builder и миграции
- **JWT** - аутентификация
- **bcryptjs** - хеширование паролей
- **QRCode** - генерация QR-кодов
- **express-validator** - валидация запросов

### Frontend:
- **React** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик проекта
- **React Router** - маршрутизация
- **Tailwind CSS** - стилизация
- **Zustand** - управление состоянием
- **Axios** - HTTP клиент
- **date-fns** - работа с датами
- **React Toastify** - уведомления

## Структура проекта

```
museum-booking-system/
├── backend/                 # Серверная часть
│   ├── src/
│   │   ├── config/         # Конфигурация (БД и т.д.)
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Middleware (auth, validation, etc.)
│   │   ├── models/         # Модели данных
│   │   ├── routes/         # API роуты
│   │   ├── services/       # Бизнес-логика
│   │   ├── types/          # TypeScript типы
│   │   ├── utils/          # Утилиты
│   │   └── server.ts       # Точка входа сервера
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Клиентская часть
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/         # Страницы
│   │   ├── services/      # API сервисы
│   │   ├── stores/        # Zustand stores
│   │   ├── types/         # TypeScript типы
│   │   ├── utils/         # Утилиты
│   │   ├── App.tsx        # Главный компонент
│   │   └── main.tsx       # Точка входа
│   ├── package.json
│   └── vite.config.ts
├── database/              # База данных
│   ├── migrations/        # Миграции БД
│   └── seeds/            # Seed данные
├── docs/                 # Документация
└── package.json          # Root package.json
```

## Установка и запуск

### Требования:
- Node.js >= 18
- PostgreSQL >= 14
- npm или yarn

### 1. Установка зависимостей

```bash
# Установка всех зависимостей (workspace)
npm install
```

### 2. Настройка базы данных

Создайте PostgreSQL базу данных:

```sql
CREATE DATABASE museum_booking;
```

Скопируйте файл `.env.example` в `.env` в папке `backend/` и настройте параметры:

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=museum_booking
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

QR_SECRET=your_qr_secret_key_change_this_in_production

FRONTEND_URL=http://localhost:3000
```

### 3. Запуск миграций

```bash
cd backend
npm run db:migrate
```

### 4. Запуск приложения

#### Development режим (одновременно backend и frontend):

```bash
# Из корневой директории
npm run dev
```

Или по отдельности:

```bash
# Backend (в одном терминале)
npm run dev:backend

# Frontend (в другом терминале)
npm run dev:frontend
```

#### Production режим:

```bash
# Сборка
npm run build

# Запуск
npm start
```

### 5. Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

## API Эндпойнты

### Аутентификация

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Получить профиль (требует auth)

### Таймслоты

- `GET /api/slots` - Получить список таймслотов
- `GET /api/slots/:id` - Получить таймслот по ID
- `POST /api/slots` - Создать таймслот (admin/coordinator)
- `PUT /api/slots/:id` - Обновить таймслот (admin/coordinator)
- `DELETE /api/slots/:id` - Удалить таймслот (admin)

### Бронирования

- `POST /api/bookings` - Забронировать таймслот (guide)
- `GET /api/bookings/my` - Мои бронирования (guide)
- `POST /api/bookings/:id/cancel` - Отменить бронирование (guide)
- `POST /api/bookings/:id/confirm` - Подтвердить бронирование (admin/coordinator)

### QR-пропуска

- `GET /api/qr/my` - Получить свой QR-код (guide)
- `POST /api/qr/scan` - Сканировать QR-код (admin/coordinator)

### Экскурсоводы

- `GET /api/guides` - Список экскурсоводов (admin/coordinator)
- `GET /api/guides/:id` - Экскурсовод по ID
- `PUT /api/guides/my/profile` - Обновить свой профиль (guide)
- `GET /api/guides/my/stats` - Моя статистика (guide)

### Выплаты

- `GET /api/payouts/my/earnings` - Мои заработки (guide)
- `POST /api/payouts` - Создать выплату (admin)
- `POST /api/payouts/:id/paid` - Отметить как оплачено (admin)

### Админ-панель

- `GET /api/admin/dashboard/stats` - Статистика дашборда
- `GET /api/admin/bookings` - Все бронирования
- `GET /api/admin/attendance` - Записи посещаемости
- `POST /api/admin/campaigns` - Создать кампанию мотивации
- `GET /api/admin/audit-logs` - Логи аудита

## Схема базы данных

### Основные таблицы:

- **users** - Пользователи системы
- **guides** - Профили экскурсоводов
- **slots** - Таймслоты экскурсий
- **bookings** - Бронирования
- **attendance** - Посещаемость (сканы QR)
- **qr_tokens** - QR-токены
- **payouts** - Выплаты
- **ratings_reviews** - Рейтинги и отзывы
- **admin_campaigns** - Кампании мотивации
- **audit_logs** - Логи аудита

## Система мотивации

Система автоматически рассчитывает выплаты на основе:

- **Базовой ставки** за экскурсию
- **Коэффициентов**:
  - Выходные дни (1.3x)
  - Иностранный язык (1.5x)
  - Тематические экскурсии (1.2x)
- **Бонусов**:
  - За быстрое бронирование
  - За достижения (10, 50, 100 экскурсий)
  - Топ-3 экскурсовода месяца

Конфигурация мотивации настраивается через админ-панель.

## QR-пропуска

QR-коды генерируются с использованием JWT и содержат:
- ID экскурсовода
- Время создания и истечения (24 часа)
- Уникальный nonce
- Подпись сервера

При сканировании:
1. Проверяется валидность JWT
2. Проверяется наличие забронированного слота в ближайшие ±30 минут
3. Создается запись в attendance
4. Экскурсовод получает подтверждение прихода

## Безопасность

- JWT токены для аутентификации
- Bcrypt хеширование паролей
- RBAC (Role-Based Access Control)
- Rate limiting на API
- Helmet.js для безопасности заголовков
- CORS настроен
- SQL injection защита через Knex.js
- XSS защита

## Лицензия

MIT License

## Контакты

Национальный музей Республики Татарстан
Email: support@museum.rt.ru

---

**Разработано для Национального музея РТ**
