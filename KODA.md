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
- [x] Фильтрация deletedAt=null во всех запросах
- [x] Ролевая защита роутов (AUTHOR, MODERATOR, ADMIN)
- [x] Middleware для проверки ролей

**Выполнено:**
- Soft delete фильтр (deletedAt: null) добавлен в /api/content
- Создан хелпер withRoleCheck и checkUserRole в lib/role-check.ts
- Защита API /api/moderation (только MODERATOR, ADMIN)
- Защита API /api/admin/users (только ADMIN)

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

---

## Функциональные модули

### 1. Модуль аутентификации (`auth/`, `forms/auth/`)
**Назначение**: Регистрация и вход пользователей
**Компоненты**:
- `forms/auth/login.form.tsx` — форма входа
- `forms/auth/registration.form.tsx` — форма регистрации
- `auth/auth.ts` — конфигурация NextAuth

**Валидация**: Базовая (email regex, пароль мин. 6 символов, подтверждение пароля)

**Зависимости**: NextAuth, HeroUI

---

### 2. Модуль контента (`app/api/content/`, `app/(public)/content/[slug]/`)
**Назначение**: Управление контентом (курсы, статьи, видео)
**API endpoints**:
- `GET /api/content` — список контента с пагинацией
- `GET /api/content/[slug]` — детальная страница контента
- `POST /api/content` — создание контента (авторы)

**Особенности**:
- Soft delete через `deletedAt`
- Теги через связь TagContent
- isPremium для платного контента

---

### 3. Модуль курсов (`app/(protected)/course/[slug]/`)
**Назначение**: Страницы курсов и уроков
**Компоненты**:
- `app/(protected)/course/[slug]/page.tsx` — страница курса
- `app/(protected)/course/[slug]/module/[moduleId]/page.tsx` — страница модуля
- `app/(protected)/lesson/[slug]/page.tsx` — страница урока

**Особенности**:
- Поддержка видео и статей
- Premium Gate для платного контента
- Прогресс обучения

---

### 4. Модуль калькуляторов (`app/(public)/calculator/`)
**Назначение**: Финансовые калькуляторы
**Калькуляторы**:
- `credit/` — кредитный калькулятор (аннуитетный/дифференцированный, досрочное погашение)
- `deposit/` — калькулятор вкладов (капитализация, пополнения, частичное снятие)
- `mortgage/` — ипотечный калькулятор

**Экспорт**: PDF и CSV (только deposit)

**Валидация**: min/max значения через Input и Slider

---

### 5. Модуль оплаты (`app/api/payment/`)
**Назначение**: Подписки и покупки
**API endpoints**:
- `POST /api/payment/subscribe` — оформление подписки
- `POST /api/payment/buy` — разовая покупка

**Особенности**: Фиктивная оплата для тестирования

---

### 6. Модуль модерации (`app/api/moderation/`, `app/(protected)/admin/moderation/`)
**Назначение**: Модерация контента
**API endpoints**:
- `GET /api/moderation` — получить контент на модерацию
- `POST /api/moderation` — approve/reject контента

**Роли**: MODERATOR, ADMIN

---

### 7. Модуль администрирования (`app/api/admin/`, `app/(protected)/admin/`)
**Назначение**: Управление пользователями
**API endpoints**:
- `GET /api/admin/users` — список пользователей
- `PATCH /api/admin/users` — изменить роль/статус пользователя

**Роли**: ADMIN

---

### 8. Модуль реакций (`app/api/reactions/`, `components/common/reactions.tsx`)
**Назначение**: Лайки/дизлайки контента и комментариев
**API endpoints**:
- `GET /api/reactions` — получить реакции
- `POST /api/reactions` — поставить реакцию

---

### 9. Модуль профиля (`app/(public)/profile/settings/`)
**Назначение**: Настройки профиля пользователя
**Компоненты**:
- `ProfileForm.tsx` — форма редактирования профиля

**Валидация**:
- Обязательные поля (имя, фамилия, никнейм, отображаемое имя)
- Никнейм: мин. 3 символа, только латинские буквы/цифры/_

---

### 10. Модуль избранного и истории (`app/api/user/favorites/`, `app/api/user/history/`)
**Назначение**: История просмотров и избранное
**API endpoints**:
- `GET/POST /api/user/favorites` — избранное
- `GET/POST /api/user/history` — история просмотров

---

### 11. Модуль сертификатов
**Назначение**: Выдача сертификатов при завершении курса
**Автоматическая генерация**: При достижении 100% прогресса

---

## Валидация форм

### Уровень 1: Базовый (HTML5 атрибуты)
- Калькуляторы: `min`, `max`, `step` в Input/Slider

### Уровень 2: Клиентский JavaScript
- `forms/auth/login.form.tsx` — проверка email/password
- `forms/auth/registration.form.tsx` — валидация email, пароля, подтверждения
- `app/(public)/profile/settings/components/ProfileForm.tsx` — полная валидация полей

### Уровень 3: Серверный (не реализовано)
- Zod схемы на сервере
- Повторная валидация при API вызовах

---

## Состояние админ-панели

### Реализовано:
- ✅ `/admin` — главная страница со статистикой
- ✅ `/admin/moderation` — модерация контента (approve/reject)
- ✅ `/admin/users` — страница управления пользователями (просмотр, редактирование роли, блокировка, удаление)
- ✅ `/admin/content` — страница управления контентом (просмотр, удаление, фильтры по типу и статусу)
- ✅ `/api/admin/users` — GET/PATCH/DELETE пользователей
- ✅ `/api/admin/content` — GET/PATCH/DELETE контента
- ✅ `/api/moderation` — approve/reject контента

### Требует реализации:
- ❌ `/admin/analytics` — аналитика
- ❌ `/admin/settings` — настройки системы

---

## Переиспользуемые компоненты и шаблоны

### UI-компоненты (components/common/)

| Компонент | Назначение | Параметры |
|-----------|------------|-----------|
| `Button` | Универсальная кнопка | `variant`, `size`, `disabled`, `isLoading` |
| `Input` | Поле ввода | `error`, `type`, `placeholder`, `value` |
| `Slider` | Слайдер с мин/макс | `min`, `max`, `step`, `value`, `onChange`, `formatLabel` |
| `Modal` | Обёртка модального окна | HeroUI Modal с кастомными стилями |

### Паттерны проектирования

#### 1. Форма с валидацией (ProfileForm)
```typescript
// Шаблон для форм с клиентской валидацией
interface FormData { ... }
const validateForm = () => { ... } // Возвращает Record<string, string>
const handleSubmit = async (e) => {
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  // Отправка на сервер
}
```

#### 2. Таблица с пагинацией (AdminUsers, AdminContent)
```typescript
// Шаблон для страниц с таблицами
const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
const fetchData = async () => {
  const res = await fetch(`/api/.../?page=${pagination.page}&limit=${pagination.limit}`);
  const data = await res.json();
  setItems(data.data);
  setPagination(prev => ({ ...prev, ...data.pagination }));
};
useEffect(() => { fetchData(); }, [pagination.page]);
```

#### 3. Модальное окно с формами (Admin Edit/Delete)
```typescript
// Использует HeroUI useDisclosure
const { isOpen, onOpen, onClose } = useDisclosure();
const [selectedItem, setSelectedItem] = useState(null);
const handleEdit = (item) => { setSelectedItem(item); onOpen(); };
// ... Modal с формой редактирования
```

#### 4. Premium Gate (блокировка контента)
```typescript
function PremiumGate({ isPremium, children }: { isPremium: boolean; children?: React.ReactNode }) {
  if (!isPremium) return <>{children}</>;
  return (
    <div className="p-6 border-2 border-dashed rounded-xl text-center">
      <p>Контент доступен по подписке</p>
      <button data-open-modal="subscribe">Оформить подписку</button>
    </div>
  );
}
```

#### 5. Калькулятор с экспортом (Deposit)
```typescript
// PDF: window.open() с HTML-контентом
// CSV: Blob + URL.createObjectURL + download link
const handleExportPDF = () => {
  const html = `<!DOCTYPE html>...${data}...</html>`;
  const win = window.open('', '_blank');
  win.document.write(html);
  win.print();
};
```

---

## Анализ форм и валидации

### Форма входа (forms/auth/login.form.tsx)
- **HTML5**: `isRequired`, `type="email"`
- **Клиентская**: Нет доп.валидации (только required)
- **Серверная**: Через NextAuth

### Форма регистрации (forms/auth/registration.form.tsx)
- **HTML5**: `isRequired`, `type="email"`
- **Клиентская**: 
  - Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Пароль мин. 6 символов
  - Подтверждение пароля
- **Серверная**: Через registerUser action

### Настройки профиля (ProfileForm.tsx)
- **HTML5**: Нет
- **Клиентская** (полная):
  - firstName/lastName/nickname/displayName: обязательно
  - nickname: мин. 3 символа, только `a-zA-Z0-9_`
  - bio: макс. 500 символов
- **Серверная**: Проверка уникальности никнейма

### Калькуляторы (CreditForm, DepositForm, MortgageForm)
- **HTML5**: `min`, `max`, `step` на Input и Slider
- **Клиентская**: Ограничения диапазонов через Slider
- **Серверная**: Нет

---

## Анализ админ-панели

### Управление пользователями (/admin/users)
- ✅ Просмотр списка с пагинацией
- ✅ Поиск по email/никнейму
- ✅ Фильтр по роли (USER/AUTHOR/MODERATOR/ADMIN)
- ✅ Редактирование роли и статуса (активен/заблокирован)
- ✅ Удаление пользователя
- ✅ Просмотр статистики контента

### Управление контентом (/admin/content)
- ✅ Просмотр списка с пагинацией
- ✅ Поиск по названию
- ✅ Фильтр по типу (COURSE/ARTICLE/VIDEO/PODCAST)
- ✅ Фильтр по статусу (DRAFT/PENDING_REVIEW/PUBLISHED/ARCHIVED)
- ✅ Просмотр деталей контента
- ✅ Удаление контента
- ❌ Редактирование контента (не реализовано)
- ❌ Создание контента (не реализовано)

### Модерация (/admin/moderation)
- ✅ Просмотр контента на модерацию
- ✅ Одобрение (approve)
- ✅ Отклонение (reject)
- ✅ Комментарий модератора

### Главная страница (/admin)
- ✅ Статистика по пользователям
- ✅ Статистика по контенту
- ✅ Статистика по подпискам
- ❌ Графики/диаграммы (не реализовано)

---

## Анализ модальных окон

### Обзор системы модальных окон

В проекте реализована централизованная система модальных окон на основе:
- **Zustand** (`store/useModalStore.ts`) — глобальное состояние для управления модалками
- **ModalProvider** (`components/providers/ModalProvider.tsx`) — рендерит активную модалку
- **ModalTrigger** (`components/common/modal-trigger.tsx`) — глобальный обработчик кликов для открытия модалок через data-атрибуты

### Доступные модальные окна

| Модалка | Назначение | Параметры |
|---------|------------|-----------|
| `auth` | Вход/регистрация | `mode`: "login" \| "register" |
| `subscribe` | Оформление подписки | - |
| `payment` | Оплата | `productId`, `priceId` |
| `confirm` | Подтверждение действия | `title`, `message`, `confirmText`, `cancelText`, `onConfirm` |
| `favorite` | Добавление в избранное | `contentId` |

### Два способа открытия модалок

#### 1. Напрямую через Zustand store (Header)
```tsx
// components/UI/layout/header.tsx
const { openModal } = useModalStore();

<button onClick={() => openModal('auth', { mode: 'login' })}>
  Войти
</button>
```

#### 2. Через data-атрибуты (любой элемент)
```tsx
// Страница курса
<button data-open-modal="subscribe">Оформить подписку</button>
<button data-open-modal="payment" data-product-id="123">Купить</button>
```

### Выявленные проблемы и решения

#### ❌ Проблема 1: Модальные окна могут не открываться при первой загрузке

**Причина**: 
- `AppLoader` возвращает `null` во время загрузки (пока `isInitialized = false`)
- `ModalProvider` использует `if (!isMounted) return null` для предотвращения гидратации
- При быстром переходе между страницами модальные окна могут не успеть инициализироваться

**Решение**: 
- Переместить `ModalProvider` и `ModalTrigger` ВЫНЕ `AppLoader`, чтобы они рендерились независимо от состояния загрузки
- В `layout.tsx` изменить структуру:

```tsx
// Было:
<Providers>
  <AppLoader>
    <div className="...">...</div>
    <ModalProvider />
    <ModalTrigger />
  </AppLoader>
</Providers>

// Стало:
<Providers>
  <AppLoader>
    <div className="...">...</div>
  </AppLoader>
  <ModalProvider />
  <ModalTrigger />
</Providers>
```

#### ❌ Проблема 2: Модальные окна могут быть скрыты из-за z-index

**Причина**: 
- Header имеет `z-50`
- Модальные окна HeroUI должны иметь высокий z-index, но могут конфликтовать с другими элементами

**Решение**:
- Добавить явный z-index в `CustomModal`:

```tsx
// components/UI/modals/modal.tsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  classNames={{
    base: "bg-white z-[9999]", // Явный z-index
    // ...
  }}
>
```

#### ❌ Проблема 3: Zustand store может не работать корректно с SSR

**Причина**: 
- Zustand создаётся на клиенте, но может использоваться на сервере
- При SSR состояние может быть не синхронизировано

**Решение**:
- Использовать `useEffect` для инициализации состояния на клиенте
- Проверить, что все компоненты, использующие `useModalStore`, являются клиентскими (`'use client'`)

#### ❌ Проблема 4: Кнопки с data-open-modal в Server Components

**Причина**:
- Страница курса (`app/(protected)/course/[slug]/page.tsx`) — Server Component
- Кнопки с `data-open-modal` работают через `ModalTrigger` на клиенте
- Теоретически это должно работать, но могут быть проблемы с инициализацией

**Решение**:
- Преобразовать страницу курса в Client Component, или
- Создать отдельный Client Component для кнопок с модалками

### Текущее состояние

| Компонент | Файл | Статус |
|-----------|------|--------|
| Zustand Store | `store/useModalStore.ts` | ✅ Работает |
| ModalProvider | `components/providers/ModalProvider.tsx` | ✅ Работает |
| ModalTrigger | `components/common/modal-trigger.tsx` | ✅ Работает |
| AuthModal | `components/UI/modals/AuthModal.tsx` | ✅ Работает |
| SubscribeModal | `components/UI/modals/SubscribeModal.tsx` | ✅ Работает |
| PaymentModal | `components/UI/modals/PaymentModal.tsx` | ✅ Работает |
| ConfirmModal | `components/UI/modals/ConfirmModal.tsx` | ✅ Работает |
| FavoriteModal | `components/UI/modals/FavoriteModal.tsx` | ✅ Работает |
| Кнопки в Header | `components/UI/layout/header.tsx` | ✅ Работает |
| Кнопки в курсах | `app/(protected)/course/[slug]/page.tsx` | ⚠️ Требует проверки |

### Рекомендуемые действия

1. **Переместить ModalProvider и ModalTrigger вне AppLoader** — это решит проблему с инициализацией при загрузке
2. **Добавить явный z-index в модальные окна** — чтобы они всегда отображались поверх других элементов
3. **Протестировать на реальном устройстве** — проверить, работают ли модальные окна во всех браузерах
4. **Добавить логирование** — для отладки проблем с модальными окнами

### Пример использования в коде

```tsx
// Открытие модального окна подписки
<button data-open-modal="subscribe">
  Оформить подписку
</button>

// Открытие модального окна оплаты с параметрами
<button 
  data-open-modal="payment" 
  data-product-id="course-123"
  data-price-id="price-456"
>
  Купить курс
</button>

// Открытие модального окна авторизации
<button onClick={() => openModal('auth', { mode: 'login' })}>
  Войти
</button>

// Открытие модального окна подтверждения
<button onClick={() => openModal('confirm', {
  title: 'Удалить?',
  message: 'Вы уверены, что хотите удалить этот элемент?',
  confirmText: 'Удалить',
  cancelText: 'Отмена',
  onConfirm: () => { /* логика удаления */ }
})}>
  Удалить
</button>
```

---

## Анализ файла proxy.ts (Middleware)

### Текущее состояние

Файл `proxy.ts` в этом проекте используется как кастомный middleware для защиты маршрутов:

```typescript
// proxy.ts (текущее состояние)
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request });
  const protectedRoutes = ["/course"]; // это пример взять просто для тестирования

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const url = new URL("/error", request.url);
      url.searchParams.set("message", "Недостаточно прав");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: ["/course"]
}
```

**Примечание**: В этом проекте используется кастомное имя `proxy.ts` вместо стандартного `middleware.ts`.

### Выявленные проблемы

| Проблема | Описание | Влияние |
|----------|----------|---------|
| **Неправильный matcher** | `matcher: ["/course"]` не матчит `/course/[slug]` | Защита не работает для детальных страниц курсов |
| **Неполный список маршрутов** | Только `/course` в списке | Остальные защищённые маршруты не защищены |
| **Неправильный редирект** | Перенаправляет на `/error` | Должен перенаправлять на страницу входа |
| **Нет ролевой защиты** | Не проверяет роли (ADMIN, AUTHOR, MODERATOR) | Не разграничивает доступ к admin/author |

### Структура маршрутов проекта

#### Публичные маршруты (не требуют авторизации)
- `/` — главная страница
- `/catalog` — каталог контента
- `/content/[slug]` — детальная страница контента
- `/article/[slug]` — статьи
- `/calculator/*` — калькуляторы (credit, deposit, mortgage)
- `/faq` — вопросы и ответы
- `/tools` — инструменты

#### Защищённые маршруты (требуют авторизации)
- `/profile/*` — личный кабинет (сейчас в `(public)`, что неправильно!)
- `/course/*` — страницы курсов
- `/lesson/*` — страницы уроков

#### Административные маршруты (требуют конкретные роли)
- `/admin/*` — только для роли ADMIN
- `/author/*` — для ролей AUTHOR, MODERATOR, ADMIN

### Рекомендуемая реализация middleware

```typescript
// middleware.ts (правильная реализация)
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;
    const userRole = token?.role as string;

    // Защита админ-панели (только ADMIN)
    if (pathname.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        const url = new URL("/profile", request.url);
        return NextResponse.redirect(url);
      }
    }

    // Защита панели автора (AUTHOR, MODERATOR, ADMIN)
    if (pathname.startsWith("/author")) {
      if (!["AUTHOR", "MODERATOR", "ADMIN"].includes(userRole)) {
        const url = new URL("/profile", request.url);
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Авторизованные пользователи проходят дальше
      authorized: ({ token }) => !!token,
    },
  }
);

// Защищённые маршруты
export const config = {
  matcher: [
    /*
     * Защищаем:
     * - /profile/:path* - личный кабинет
     * - /course/:path* - курсы
     * - /lesson/:path* - уроки
     * - /admin/:path* - админ-панель
     * - /author/:path* - панель автора
     */
    "/profile/:path*",
    "/course/:path*",
    "/lesson/:path*",
    "/admin/:path*",
    "/author/:path*",
  ],
};
```

### Что нужно исправить

1. **Использовать `withAuth`**: Это официальный способ защиты маршрутов в NextAuth (можно оставить имя `proxy.ts`)

2. **Добавить все защищённые маршруты**:
   - `/profile/*` — личный кабинет
   - `/course/*` — курсы
   - `/lesson/*` — уроки
   - `/admin/*` — админ-панель (дополнительно проверить роль ADMIN)
   - `/author/*` — панель автора (дополнительно проверить роли AUTHOR, MODERATOR, ADMIN)

3. **Перенаправлять на страницу входа**: Вместо `/error` перенаправлять на `/auth` или показывать модальное окно

4. **Переместить `/profile`**: Из `(public)/profile` в `(protected)/profile`

### Альтернативный вариант (без middleware)

Если не хотите использовать middleware, можно добавить проверку на каждой странице:

```typescript
// app/(protected)/profile/page.tsx
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session) {
    redirect("/?auth=login"); // или открыть модалку авторизации
  }
  
  return <div>Личный кабинет</div>;
}
```

### Итоговые рекомендации

| Действие | Приоритет | Описание |
|----------|-----------|----------|
| Добавить все защищённые маршруты | Высокий | /profile, /course, /lesson, /admin, /author |
| Добавить ролевую проверку | Средний | ADMIN для /admin, AUTHOR для /author |
| Переместить /profile в protected | Средний | Сейчас он в public директории |
| Изменить редирект на /auth | Низкий | Вместо /error показывать форму входа |
