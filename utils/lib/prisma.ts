// import path from 'path';
// import dotenv from 'dotenv';

// // Явно указываем путь к файлу .env в корне проекта


import "dotenv/config";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'server-only';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Создаем соединение через драйвер 'pg'
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

// 2. Оборачиваем его в адаптер Prisma
const adapter = new PrismaPg(pool);

// 3. Инициализируем клиент с адаптером
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Добавьте этот лог для проверки (только для отладки)
if (!process.env.DATABASE_URL) {
  console.error("КРИТИЧЕСКАЯ ОШИБКА: DATABASE_URL не найден в process.env!");
}

export default prisma;
