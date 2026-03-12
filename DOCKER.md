# Docker - Инструкция по работе

## Быстрый старт

### 1. Создайте .env файл для production

```env
# База данных
POSTGRES_USER=economikus
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=economikus

# NextAuth
AUTH_SECRET=your_auth_secret_minimum_32_characters_long
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Запуск

```bash
# Запуск в фоновом режиме
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### 3. Миграции базы данных

```bash
# Применить миграции
docker-compose exec app npx prisma migrate deploy

# Заполнить начальными данными
docker-compose exec app npx prisma db seed
```

---

## Полезные команды

### Сборка и запуск

```bash
# Пересобрать образ
docker-compose build --no-cache

# Запуск с пересборкой
docker-compose up -d --build

# Остановка с удалением данных
docker-compose down -v
```

### Просмотр статуса

```bash
# Статус контейнеров
docker-compose ps

# Логи приложения
docker-compose logs -f app

# Логи базы данных
docker-compose logs -f postgres
```

### Работа с базой данных

```bash
# Подключиться к PostgreSQL
docker-compose exec postgres psql -U economikus -d economikus

# Создать бэкап
docker-compose exec postgres pg_dump -U economikus economikus > backup.sql

# Восстановить из бэкапа
cat backup.sql | docker-compose exec -T postgres psql -U economikus economikus
```

### Prisma Studio

```bash
# Запустить Prisma Studio (требуется локальный Node.js)
npx prisma studio
```

---

## Production деплой

### 1. Подготовка сервера

```bash
# Установите Docker и Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Клонирование и настройка

```bash
git clone <your-repo>
cd <your-repo>

# Создайте .env файл с production настройками
cp .env.example .env
nano .env
```

### 3. Запуск

```bash
docker-compose up -d --build
```

### 4. Настройка SSL (опционально)

Для SSL используйте nginx-proxy + let's encrypt или настройте свой reverse proxy.

---

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `POSTGRES_USER` | Пользователь PostgreSQL | `economikus` |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL | `economikus_secret` |
| `POSTGRES_DB` | Имя базы данных | `economikus` |
| `AUTH_SECRET` | Секрет для NextAuth | - (обязательно) |
| `NEXTAUTH_URL` | URL приложения | `http://localhost:3000` |
| `NEXT_PUBLIC_BASE_URL` | Публичный URL | `http://localhost:3000` |

---

## Траблшутинг

### Ошибка подключения к базе данных

```bash
# Проверьте, что база данных запущена
docker-compose ps postgres

# Проверьте логи
docker-compose logs postgres
```

### Ошибка миграций

```bash
# Сброс базы данных (ВНИМАНИЕ: удаляет все данные!)
docker-compose exec app npx prisma migrate reset
```

### Ошибка сборки

```bash
# Очистите кэш Docker
docker-compose build --no-cache
docker-compose up -d
```

---

## Размер образа

Оптимизированный образ Next.js standalone:
- Базовый образ: `node:20-alpine` (~50MB)
- Итоговый размер: ~200-300MB

---

## Безопасность

1. **Никогда не коммитьте .env файлы**
2. **Используйте сильные пароли** для `POSTGRES_PASSWORD` и `AUTH_SECRET`
3. **Ограничьте доступ к портам** на production сервере
4. **Регулярно обновляйте** базовые образы: `docker-compose pull && docker-compose up -d`
