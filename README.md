# Warehouse Management System - Backend

Система складского учёта с чистой архитектурой.

## Технологии

- **NestJS** - backend framework
- **TypeScript** - язык программирования
- **Prisma** - ORM для PostgreSQL
- **PostgreSQL** - база данных
- **JWT** - аутентификация
- **Swagger** - документация API

## Структура проекта (Чистая архитектура)

```
src/
├── domain/                    # Бизнес-сущности и интерфейсы
│   ├── entities/              # Domain entities
│   └── repositories/          # Repository interfaces
│
├── application/               # Use Cases (бизнес-логика)
│   ├── use-cases/            # Application use cases
│   └── dto/                  # Data Transfer Objects
│
├── infrastructure/            # Реализации инфраструктуры
│   ├── database/             # Prisma и репозитории
│   └── services/             # JWT, Hash services
│
├── presentation/              # Controllers и API
│   ├── controllers/          # REST controllers
│   ├── guards/               # Auth guards
│   ├── decorators/           # Custom decorators
│   └── strategies/           # Passport strategies
│
└── modules/                   # NestJS modules
```

## Установка

```bash
# Настройка Node.js через fnm
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
fnm use lts-latest

# Установка зависимостей
npm install

# Запуск PostgreSQL
docker-compose up -d

# Генерация Prisma клиента
npm run prisma:generate

# Применение миграций
npm run prisma:migrate

# Запуск в режиме разработки
npm run start:dev
```

## API Endpoints

### Аутентификация

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/auth/register` | Регистрация пользователя |
| POST | `/auth/login` | Вход в систему |
| POST | `/auth/refresh` | Обновление токенов |
| POST | `/auth/logout` | Выход из системы |
| POST | `/auth/logout-all` | Выход со всех устройств |
| GET | `/auth/me` | Получение профиля |

## Swagger документация

После запуска сервера документация доступна по адресу:
```
http://localhost:3000/api
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и настройте:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/warehouse_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
```
