# KODA.md — Инструкции для работы с проектом

## Обзор проекта

**Название**: Экономикус (Economikus)  
**Тип**: Образовательная платформа (LMS — Learning Management System)  
**Веб-сайт**: economikus.ru
**Репозиторий дизайна**: https://github.com/Cat-hippopatam/fin

Платформа для обучения финансам и инвестициям. Включает курсы, модули, статьи, видео, подписки, платежи и сертификаты.

---

## Целевая аудитория

1. **Стартующий (18-24 года)**: студенты, мало денег, нужны базовые знания
2. **Строитель (25-34 года)**: есть доход, нет времени, боится ошибок
3. **Семьянин (35-44 года)**: есть накопления, нужна безопасная стратегия

---

## Цветовая палитра (из макета)

Используется в `app/globals.css`:

```css
:root {
  --background: #F8F6F3;
  --foreground: #264653;
  --primary: #F4A261;        /* Оранжевый */
  --secondary: #2A9D8F;      /* Бирюзовый */
  --accent: #F4A261;
  --muted: #6C757D;
  --destructive: #FF6B6B;
  --border: #E9ECEF;
}
```

**Примечание**: Цвета из макета https://github.com/Cat-hippopatam/fin имеют приоритет над описанными в ТЗ.

---

## Технологический стек

| Категория | Технология |
|-----------|------------|
| Фреймворк | Next.js 16 (App Router) |
| Язык | TypeScript (strict mode) |
| База данных | PostgreSQL + Prisma ORM |
| Аутентификация | NextAuth v5 (Auth.js) |
| UI-библиотека | HeroUI (headless UI на React) |
| Стили | TailwindCSS v4 |
| Стейт-менеджмент | Zustand |
| Валидация | Zod |
| Анимации | Framer Motion |
| Линтинг | ESLint (eslint-config-next) |

---

## Структура проекта

```
├── app/                    # Next.js App Router
│   ├── (public)/           # Публичные маршруты
│   ├── (protected)/        # Защищённые маршруты (требуют авторизации)
│   ├── api/                # API-роуты
│   ├── layout.tsx          # Корневой layout
│   └── page.tsx            # Главная страница
├── auth/                   # Конфигурация NextAuth
├── components/
│   ├── common/             # Общие переиспользуемые компоненты
│   ├── home/               # Компоненты главной страницы
│   ├── providers/          # React Context провайдеры
│   └── UI/                 # UI-компоненты (layout, modals)
├── config/                 # Конфигурация сайта (site.config.ts)
├── prisma/
│   ├── schema.prisma       # Схема базы данных
│   ├── migrations/         # Миграции БД
│   └── seed.ts             # Сидирование данных
├── store/                  # Zustand-сторы
├── types/                  # TypeScript-типы
└── utils/                  # Утилиты и вспомогательные функции
```

### Ключевые директории

- **`app/(public)/`** — публичные страницы (каталог, статьи, калькуляторы, FAQ)
- **`app/(protected)/`** — страницы личного кабинета, курсов
- **`components/UI/layout/`** — компоненты layout (navbar, footer)
- **`components/UI/modals/`** — модальные окна
- **`store/`** — глобальное состояние (auth.store.ts, useModalStore.ts)

---

## База данных (Prisma)

Проект использует расширенную схему PostgreSQL с множеством связанных моделей:

### Основные модели

| Модель | Назначение |
|--------|------------|
| `User` | Пользователь системы (имеет связь с Profile) |
| `Profile` | Публичный профиль пользователя (никнейм, аватар, статистика) |
| `Content` | Контент: курсы, модули, статьи, видео, подкасты, квизы |
| `Module` | Модули внутри курсов |
| `Tag` / `TagContent` | Теги для контента |
| `Comment` | Комментарии с древовидной структурой |
| `ContentReaction` / `CommentReaction` | Лайки/дизлайки |
| `Favorite` | Избранное |
| `History` | История просмотров |
| `Progress` | Прогресс обучения |
| `Subscription` | Подписки пользователей |
| `Transaction` | Транзакции и платежи |
| `PaymentMethod` | Методы оплаты |
| `Certificate` | Сертификаты о прохождении курсов |
| `Notification` | Уведомления |
| `ModerationItem` | Очередь модерации |
| `BusinessEvent` | События аналитики |

### Enums в схеме

- `Role`: USER, AUTHOR, MODERATOR, ADMIN
- `ContentType`: COURSE, MODULE, ARTICLE, VIDEO, PODCAST, QUIZ, TASK
- `ContentStatus`: DRAFT, PENDING_REVIEW, PUBLISHED, ARCHIVED, DELETED
- `DifficultyLevel`: BEGINNER, INTERMEDIATE, ADVANCED
- `SubscriptionStatus`: ACTIVE, PAST_DUE, CANCELED, EXPIRED
- `TransactionStatus`: PENDING, COMPLETED, FAILED, REFUNDED

---

## Команды для работы с проектом

### Основные команды

```bash
# Запуск dev-сервера
npm run dev

# Сборка проекта
npm run build

# Запуск продакшн-версии
npm run start

# Запуск линтера
npm run lint
```

### Очистка порта 3000 (Windows)

Если порт занят и нужно перезапустить dev-сервер:

```powershell
# Найти процесс на порту 3000
Get-NetTCPConnection -LocalPort 3000

# Остановить конкретный процесс (замените ID на реальный)
Stop-Process -Id <PROCESS_ID> -Force

# Или более мягкий способ - проверить занят ли порт перед запуском
$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

### Работа с Prisma

```bash
# Применение миграций
npx prisma migrate dev

# Генерация Prisma Client
npx prisma generate

# Просмотр Studio (web-интерфейс БД)
npx prisma studio

# Сидирование БД
npx prisma db seed
```

---

## Конфигурация

### Основные конфиги

- **`config/site.config.ts`** — настройки сайта (название, навигация, цвета, контакты)
- **`eslint.config.mjs`** — правила линтера (на базе eslint-config-next)
- **`tsconfig.json`** — настройки TypeScript (strict mode, path aliases `@/*`)
- **`next.config.ts`** — конфигурация Next.js
- **`tailwind.config.mjs`** / **`postcss.config.mjs`** — стили
- **`prisma/schema.prisma`** — схема БД

### Переменные окружения

Требуется настроить `.env` файл с переменными для:
- Базы данных PostgreSQL (DATABASE_URL)
- NextAuth (AUTH_SECRET, провайдеры)
- Платежных систем (если есть)

---

## Правила разработки

### Стиль кода

- **TypeScript**: Strict mode включён
- **Именование**: camelCase в коде, snake_case в Prisma-схеме
- **Компоненты**: функциональные компоненты с TypeScript
- **Импорты**: используется alias `@/*` для абсолютных импортов

### Структура компонентов

```typescript
// Пример структуры компонента
import { useState } from "react";
import { cn } from "@/utils/cn";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function ComponentName({ className, children }: Props) {
  const [state, setState] = useState(false);
  
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### Работа с Zustand

```typescript
// store/example.store.ts
import { create } from "zustand";

interface State {
  value: string;
  setValue: (value: string) => void;
}

export const useExampleStore = create<State>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
```

### Работа с формами

- Используется **Zod** для валидации схем
- **HeroUI Form** для UI компонентов форм

### Роутинг

- Публичные маршруты: `app/(public)/`
- Защищённые маршруты: `app/(protected)/`
- API-роуты: `app/api/`

---

## Часто используемые паттерны

### Server Components (по умолчанию в App Router)

```typescript
// app/page.tsx
export default function Page() {
  return <div>Server Component</div>;
}
```

### Client Components

```typescript
// components/Example.tsx
"use client";

import { useState } from "react";

export function Example() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(s => s + 1)}>{state}</button>;
}
```

### Получение данных (Prisma)

```typescript
import { prisma } from "@/lib/prisma";

export async function getData() {
  return await prisma.content.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true },
  });
}
```

---

## Текущее состояние проекта

### ✅ Уже реализовано

**Публичные страницы:**
- `app/(public)/article/` — статьи
- `app/(public)/calculator/` — калькуляторы (credit, deposit, mortgage)
- `app/(public)/catalog/` — каталог контента
- `app/(public)/content/[slug]/` — детальная страница контента
- `app/(public)/faq/` — вопросы и ответы
- `app/(public)/tools/` — инструменты

**Страницы профиля (protected):**
- `app/(protected)/profile/courses/` — мои курсы, прогресс, сертификаты
- `app/(protected)/profile/favorites/` — избранное, коллекции
- `app/(protected)/profile/settings/` — настройки профиля
- `app/(protected)/profile/subscription/` — подписка, история платежей

**API-роуты:**
- `app/api/auth/[...nextauth]/` — аутентификация
- `app/api/content/` — контент (list, by slug)
- `app/api/user/profile/` — профиль пользователя

**Компоненты:**
- Модальные окна: AuthModal, ConfirmModal, FavoriteModal, PaymentModal, SubscribeModal
- Store: `store/useModalStore.ts` — единый интерфейс управления модалками

**База данных:**
- Полная схема Prisma с 21 моделью
- Миграции применены
- Seed-данные готовы

---

## Этапы разработки

### Этап 1. Инвентаризация и выравнивание дизайна
- [ ] Подтянуть токены и переменные цветов из репозитория макета в globals.css
- [ ] Единая типографика, отступы, UI-компоненты

### Этап 2. Роутинг и страницы контента
- [x] `/course/[slug]` — страница курса с модулями
- [x] `/course/[slug]/module/[moduleId]` — страница модуля
- [x] `/lesson/[slug]` — страница урока (видео/статья)
- [ ] Расширенный поиск/фильтры/сортировка в каталоге

**Выполнено:**
- Созданы API endpoints: `/api/course/[slug]`, `/api/course/[slug]/module/[moduleId]`, `/api/lesson/[slug]`
- Созданы страницы: курс, модуль, урок
- Исправлен формат params для Next.js 16 (Promise)

### Этап 3. Платный доступ и фиктивная оплата
- [x] API: POST /api/payment/subscribe (фиктивная транзакция)
- [x] API: POST /api/payment/buy (покупка контента)
- [x] Гейтинг контента: проверка premium-доступа
- [x] Визуальные бейджи premium

**Выполнено:**
- Создан API /api/payment/subscribe с фиктивной транзакцией и подпиской
- Создан API /api/payment/buy для покупки контента
- Premium бейдж на странице курса
- Premium Gate на странице урока с кнопками подписки/покупки
- Кнопки с data-open-modal для открытия модалок оплаты

### Этап 4. ЛК: прогресс/история/избранное/реакции
- [x] `/profile/history` — история просмотров
- [x] Progress API и UI
- [x] Reactions (лайк/дизлайк контента и комментариев)
- [x] Синхронизация избранного с API

**Выполнено:**
- API: GET/POST /api/user/history — история просмотров
- API: GET/POST /api/user/progress — прогресс обучения
- API: GET/POST /api/reactions — лайки/дизлайки контента
- API: GET/POST /api/user/favorites — избранное
- Компонент Reactions для интерактивных реакций
- Компонент ViewTracker для записи просмотров
- Автоматическое создание сертификата при завершении курса

### Этап 5. Авторы и модерация
- [x] `/author/dashboard` — кабинет автора
- [ ] Создание/редактирование контента
- [x] `/moderator` — панель модератора
- [x] `/admin` — панель администратора

**Выполнено:**
- Страница /admin — главная админ-панель со статистикой
- Страница /admin/moderation — модерация контента (одобрение/отклонение)
- Страница /author/dashboard — кабинет автора со статистикой и списком контента
- API /api/admin/users — управление пользователями
- API /api/moderation — модерация контента

### Этап 6. Модалки и UX
- [x] Унификация модальных окон (Portal, focus trap, body-scroll-lock)
- [x] Добавить недостающие модалки
- [x] Исправить баги с модалками

**Выполнено:**
- Создан `ModalTrigger` — глобальный обработчик кликов для открытия модалок через data-атрибуты
- Реализован механизм: `<button data-open-modal="subscribe">`, `<button data-open-modal="payment" data-product-id="123">`
- ModalProvider корректно подключён в layout
- Поддерживаемые модалки: auth, subscribe, payment, confirm, favorite

### Этап 7. Soft delete и роли
- [ ] Фильтрация deletedAt=null во всех запросах
- [ ] Ролевая защита роутов (AUTHOR, MODERATOR, ADMIN)
- [ ] Middleware для проверки ролей

---

## Ключевые архитектурные особенности

### User vs Profile
- **User** — только аутентификация и глобальные данные
- **Profile** — центральная сущность для всех действий (комментарии, реакции, покупки)

### Полиморфизм контента
- **Content** — полиморфная структура: курсы → модули → уроки
- Типы: COURSE, MODULE, ARTICLE, VIDEO, PODCAST, QUIZ, TASK

### Reactions
- Разделены на ContentReaction и CommentReaction (без полиморфизма)

### Soft delete
- Почти везде есть поле `deletedAt` для мягкого удаления

---

## TODO / notes

- Авторизация через провайдеры (Google, VK, Yandex, GitHub) — НЕ требуется реализовывать
- Платёжная интеграция (ЮKassa) — только имитация для тестирования
- Приоритет стилей: макет из https://github.com/Cat-hippopatam/fin

---

## Правило завершения работы

**Важно**: При завершении работы в чате необходимо:

1. **Отразить выполненную работу**: что сделано, на чём остановлен процесс, что планируется сделать далее
2. **Сделать коммит** в функциональный репозиторий: https://github.com/Cat-hippopatam/tes
3. **Обновить KODA.md** с актуальным состоянием этапов

Репозитории:
- **Функциональный репозиторий** (основной): https://github.com/Cat-hippopatam/tes — сюда делаем коммиты
- **Репозиторий дизайна**: https://github.com/Cat-hippopatam/fin — макеты и стили
