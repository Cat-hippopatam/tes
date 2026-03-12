# ============================================
# Dockerfile для Economikus (Next.js + Prisma)
# ============================================

# Этап 1: Установка зависимостей
FROM node:20-alpine AS deps
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma Client
RUN npx prisma generate

# ============================================
# Этап 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем зависимости из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Собираем приложение
RUN npm run build

# ============================================
# Этап 3: Production образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем публичные файлы
COPY --from=builder /app/public ./public

# Копируем встроенное приложение Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем Prisma для миграций
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Копируем node_modules для Prisma
COPY --from=builder /app/node_modules ./node_modules

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]
