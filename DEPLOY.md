# Деплой в облако

## Варианты хостинга для Economikus

### 1. Railway.app (Рекомендуется для быстрого старта)

**Преимущества:**
- Простой деплой из GitHub
- Бесплатный tier ($5/мес кредиты)
- Автоматический PostgreSQL
- Поддержка Docker

**Инструкция:**

```bash
# 1. Установите Railway CLI
npm install -g @railway/cli

# 2. Авторизуйтесь
railway login

# 3. Создайте проект
railway init

# 4. Добавьте PostgreSQL
railway add --database postgres

# 5. Деплой
railway up

# 6. Установите переменные окружения
railway variables set AUTH_SECRET=your_secret_here
railway variables set NEXTAUTH_URL=https://your-app.railway.app
```

Или через веб-интерфейс:
1. https://railway.app → New Project → Deploy from GitHub repo
2. Add PostgreSQL
3. Set variables
4. Deploy

---

### 2. Render.com (Бесплатный вариант)

**Преимущества:**
- Бесплатный tier (с ограничениями)
- Простой веб-интерфейс
- Автоматический SSL

**Инструкция:**

1. Создайте аккаунт: https://dashboard.render.com
2. New → PostgreSQL (создайте базу данных)
3. New → Web Service
4. Подключите GitHub репозиторий
5. Настройки:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
6. Добавьте переменные окружения

---

### 3. Fly.io

**Преимущества:**
- Глобальный CDN
- Простая CLI
- Бесплатный tier

**Инструкция:**

```bash
# 1. Установите flyctl
curl -L https://fly.io/install.sh | sh

# 2. Авторизуйтесь
fly auth login

# 3. Создайте приложение
fly apps create economikus

# 4. Создайте PostgreSQL
fly postgres create

# 5. Привяжите базу данных
fly postgres attach <db-name>

# 6. Деплой
fly deploy
```

---

### 4. Docker Hub + VPS

Для полного контроля используйте VPS + Docker Hub:

**Шаг 1: Публикация образа в Docker Hub**

```bash
# Авторизуйтесь в Docker Hub
docker login

# Соберите образ
docker build -t economikus .

# Тегните образ
docker tag economikus:latest YOUR_USERNAME/economikus:latest

# Загрузите в Docker Hub
docker push YOUR_USERNAME/economikus:latest
```

**Шаг 2: Деплой на VPS**

```bash
# На сервере
docker pull YOUR_USERNAME/economikus:latest
docker-compose up -d
```

---

### 5. GitHub Container Registry (ghcr.io)

```bash
# Авторизуйтесь в GitHub
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Тегните и загрузите
docker tag economikus:latest ghcr.io/YOUR_USERNAME/economikus:latest
docker push ghcr.io/YOUR_USERNAME/economikus:latest
```

---

## Сравнение платформ

| Платформа | Бесплатный tier | PostgreSQL | Сложность |
|-----------|----------------|------------|-----------|
| Railway.app | $5/мес кредиты | ✅ Встроенный | ⭐ Простой |
| Render.com | ✅ Да (ограничен) | ✅ Встроенный | ⭐ Простой |
| Fly.io | ✅ Да | ✅ Встроенный | ⭐⭐ Средний |
| VPS + Docker Hub | ❌ Нет | ⚙️ Настраивается | ⭐⭐⭐ Сложный |
| Vercel | ✅ Да | ❌ Внешний | ⭐ Простой |

---

## Рекомендация

Для **быстрого старта** → **Railway.app** или **Render.com**

Для **production** → **VPS** с Docker или **Fly.io**

---

## Автоматический деплой через GitHub Actions

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## Переменные окружения для production

Обязательно установите на платформе:

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=minimum_32_characters_secret
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```
