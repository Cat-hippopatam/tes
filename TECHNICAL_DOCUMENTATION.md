# Экономикус (Economikus) - Техническая документация

> Подробное техническое описание проекта для разработчиков и архитекторов

---

## Содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Технологический стек](#2-технологический-стек)
3. [База данных](#3-база-данных)
4. [API Endpoints](#4-api-endpoints)
5. [Страницы и маршруты](#5-страницы-и-маршруты)
6. [Компоненты](#6-компоненты)
7. [Формы и валидация](#7-формы-и-валидация)
8. [Модальные окна](#8-модальные-окна)
9. [Калькуляторы](#9-калькуляторы)
10. [Админ-панель](#10-админ-панель)
11. [Аутентификация](#11-аутентификация)
12. [Структура проекта](#12-структура-проекта)

---

## 1. Обзор проекта

**Название**: Экономикус (Economikus)  
**Тип**: Образовательная платформа (LMS — Learning Management System)  
**Веб-сайт**: economikus.ru  
**Репозиторий**: https://github.com/Cat-hippopatam/tes

Платформа для обучения финансам и инвестициям. Включает курсы, модули, статьи, видео, подписки, платежи и сертификаты.

### Целевая аудитория

1. **Стартующий (18-24 года)**: студенты, мало денег, нужны базовые знания
2. **Строитель (25-34 года)**: есть доход, нет времени, боится ошибок
3. **Семьянин (35-44 года)**: есть накопления, нужна безопасная стратегия

---

## 2. Технологический стек

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
| Иконки | Lucide React, Heroicons |
| HTML Sanitization | isomorphic-dompurify |

---

## 3. База данных

### 3.1 Схема PostgreSQL (Prisma ORM)

Проект использует расширенную схему PostgreSQL с 21 моделью:

#### Основные модели

| Модель | Назначение | Ключевые поля |
|--------|------------|---------------|
| **User** | Пользователь системы | email, firstName, lastName, role, isBlocked |
| **Profile** | Публичный профиль | userId, nickname, displayName, avatarUrl, bio |
| **Content** | Контент (курсы, статьи, видео) | type, title, slug, body, videoUrl, isPremium |
| **Module** | Модули внутри курсов | courseId, title, sortOrder, lessonsCount |
| **Tag** | Теги контента | name, slug, color, contentCount |
| **TagContent** | Связь тегов с контентом | tagId, contentId |
| **Comment** | Комментарии | contentId, authorProfileId, text, parentId (древовидная) |
| **ContentReaction** | Лайки/дизлайки контента | profileId, contentId, type |
| **CommentReaction** | Лайки/дизлайки комментариев | profileId, commentId, type |
| **Favorite** | Избранное | profileId, contentId, collection |
| **History** | История просмотров | profileId, contentId, watchedSeconds, completed |
| **Progress** | Прогресс обучения | profileId, contentId, status, progressPercent |
| **Subscription** | Подписки пользователей | profileId, planType, status, startDate, endDate |
| **Transaction** | Транзакции и платежи | profileId, type, amount, status, provider |
| **PaymentMethod** | Методы оплаты | profileId, type, provider, last4, cardType |
| **Certificate** | Сертификаты курсов | profileId, contentId, certificateNumber, imageUrl, pdfUrl |
| **ModerationItem** | Очередь модерации | itemType, itemId, status, submittedByProfileId |
| **Notification** | Уведомления | profileId, type, title, body, isRead |
| **BusinessEvent** | События аналитики | profileId, eventType, eventCategory, metadata |
| **Attachment** | Вложения контента | contentId, name, fileName, url, mimeType |
| **Session** | Сессии пользователей | sessionToken, userId, expires |
| **Account** | OAuth аккаунты | userId, provider, providerAccountId |

#### 3.2 Enums (перечисления)

```prisma
// Роли пользователей
enum Role {
  USER      // Обычный пользователь
  AUTHOR    // Автор контента
  MODERATOR // Модератор
  ADMIN     // Администратор
}

// Типы контента
enum ContentType {
  COURSE    // Курс
  MODULE    // Модуль (внутри курса)
  ARTICLE   // Статья
  VIDEO     // Видео
  PODCAST   // Подкаст
  QUIZ      // Тест/квиз
  TASK      // Задание
}

// Статусы контента
enum ContentStatus {
  DRAFT           // Черновик
  PENDING_REVIEW  // На модерации
  PUBLISHED       // Опубликован
  ARCHIVED        // В архиве
  DELETED         // Удалён (soft delete)
}

// Уровень сложности
enum DifficultyLevel {
  BEGINNER      // Начинающий
  INTERMEDIATE  // Средний
  ADVANCED      // Продвинутый
}

// Статусы подписки
enum SubscriptionStatus {
  ACTIVE      // Активна
  PAST_DUE    // Просрочена
  CANCELED    // Отменена
  EXPIRED     // Истекла
}

// Статусы транзакций
enum TransactionStatus {
  PENDING    // В ожидании
  COMPLETED  // Завершена
  FAILED     // Ошибка
  REFUNDED   // Возвращена
}

// Типы реакций
enum ReactionType {
  LIKE
  DISLIKE
}

// Статусы модерации
enum ModerationStatus {
  PENDING   // На рассмотрении
  APPROVED  // Одобрено
  REJECTED  // Отклонено
}
```

#### 3.3 Особенности реализации

- **Soft Delete**: Почти все модели имеют поле `deletedAt` для мягкого удаления
- **User vs Profile**: 
  - User — только аутентификация и глобальные данные
  - Profile — центральная сущность для всех действий (комментарии, реакции, покупки)
- **Полиморфизм контента**: Content может быть курсом, статьёй, видео — тип определяется полем `type`
- **Кешированная статистика**: Content хранит viewsCount, likesCount, commentsCount, favoritesCount

---

## 4. API Endpoints

### 4.1 Аутентификация

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET/POST | `/api/auth/[...nextauth]` | OAuth и credentials аутентификация | Все |

### 4.2 Контент

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/content` | Список контента с пагинацией и фильтрами | Все |
| GET | `/api/content/[slug]` | Детальная страница контента | Все |
| POST | `/api/content` | Создание контента | AUTHOR, MODERATOR, ADMIN |

**Параметры запроса `/api/content`:**
- `page` — номер страницы (по умолчанию 1)
- `limit` — количество на странице (по умолчанию 20)
- `type` — фильтр по типу (COURSE, ARTICLE, VIDEO, PODCAST)
- `status` — фильтр по статусу (PUBLISHED, DRAFT, etc.)
- `tag` — фильтр по тегу (slug тега)
- `search` — поиск по названию
- `author` — фильтр по автору
- `difficulty` — фильтр по сложности
- `isPremium` — фильтр по premium статусу

### 4.3 Курсы и уроки

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/course/[slug]` | Информация о курсе с модулями | Все |
| GET | `/api/course/[slug]/module/[moduleId]` | Информация о модуле с уроками | Все |
| GET | `/api/lesson/[slug]` | Информация об уроке | Все |

### 4.4 Пользователь

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET/POST/PATCH | `/api/user/profile` | Профиль пользователя | Авторизованный |
| GET/POST | `/api/user/history` | История просмотров | Авторизованный |
| GET/POST | `/api/user/favorites` | Избранное | Авторизованный |
| GET/POST | `/api/user/progress` | Прогресс обучения | Авторизованный |

### 4.5 Реакции

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/reactions` | Получить реакции контента | Все |
| POST | `/api/reactions` | Поставить реакцию (лайк/дизлайк) | Авторизованный |

### 4.6 Платежи (фиктивные)

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| POST | `/api/payment/subscribe` | Оформление подписки | Авторизованный |
| POST | `/api/payment/buy` | Покупка контента | Авторизованный |

### 4.7 Модерация

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/moderation` | Получить контент на модерацию | MODERATOR, ADMIN |
| POST | `/api/moderation` | Одобрение/отклонение контента | MODERATOR, ADMIN |

### 4.8 Администрирование

| Метод | Путь | Описание | Доступ |
|-------|------|----------|--------|
| GET | `/api/admin/users` | Список пользователей | ADMIN |
| PATCH | `/api/admin/users` | Изменить пользователя | ADMIN |
| DELETE | `/api/admin/users` | Удалить пользователя | ADMIN |
| GET | `/api/admin/content` | Список контента | ADMIN |
| DELETE | `/api/admin/content` | Удалить контент | ADMIN |

---

## 5. Страницы и маршруты

### 5.1 Публичные маршруты (`app/(public)/`)

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/` | `page.tsx` | Главная страница |
| `/catalog` | `catalog/page.tsx` | Каталог контента |
| `/content/[slug]` | `content/[slug]/page.tsx` | Детальная страница контента |
| `/article` | `article/page.tsx` | Статьи |
| `/faq` | `faq/page.tsx` | Вопросы и ответы |
| `/tools` | `tools/page.tsx` | Инструменты |
| `/calculator` | `calculator/layout.tsx` | Калькуляторы (редирект) |
| `/calculator/credit` | `calculator/credit/page.tsx` | Кредитный калькулятор |
| `/calculator/deposit` | `calculator/deposit/page.tsx` | Калькулятор вкладов |
| `/calculator/mortgage` | `calculator/mortgage/page.tsx` | Ипотечный калькулятор |
| `/login` | `login/page.tsx` | Страница входа |
| `/register` | `register/page.tsx` | Страница регистрации |
| `/profile` | `profile/page.tsx` | Личный кабинет |
| `/profile/courses` | `profile/courses/page.tsx` | Мои курсы |
| `/profile/favorites` | `profile/favorites/page.tsx` | Избранное |
| `/profile/settings` | `profile/settings/page.tsx` | Настройки профиля |
| `/profile/subscription` | `profile/subscription/page.tsx` | Подписка |

### 5.2 Защищённые маршруты (`app/(protected)/`)

| Путь | Компонент | Описание | Требование |
|------|-----------|----------|------------|
| `/course/[slug]` | `course/[slug]/page.tsx` | Страница курса | Авторизация |
| `/course/[slug]/module/[moduleId]` | `course/[slug]/module/[moduleId]/page.tsx` | Страница модуля | Авторизация |
| `/lesson/[slug]` | `lesson/[slug]/page.tsx` | Страница урока | Авторизация |
| `/admin` | `admin/page.tsx` | Главная админ-панель | ADMIN |
| `/admin/users` | `admin/users/page.tsx` | Управление пользователями | ADMIN |
| `/admin/content` | `admin/content/page.tsx` | Управление контентом | ADMIN |
| `/admin/moderation` | `admin/moderation/page.tsx` | Модерация контента | MODERATOR, ADMIN |
| `/author/dashboard` | `author/dashboard/page.tsx` | Панель автора | AUTHOR, MODERATOR, ADMIN |

---

## 6. Компоненты

### 6.1 Общие компоненты (`components/common/`)

| Компонент | Назначение | Параметры |
|-----------|------------|-----------|
| `Button` | Универсальная кнопка | variant, size, disabled, isLoading |
| `Input` | Поле ввода | error, type, placeholder, value |
| `Slider` | Слайдер с мин/макс | min, max, step, value, onChange, formatLabel |
| `Reactions` | Лайки/дизлайки контента | contentId, initialLikes, initialDislikes |
| `ViewTracker` | Отслеживание просмотров | contentId |

### 6.2 UI компоненты (`components/UI/`)

#### Layout
| Компонент | Назначение |
|-----------|------------|
| `layout/header.tsx` | Шапка сайта с навигацией |
| `layout/footer.tsx` | Подвал сайта |

#### Modals (модальные окна)
| Компонент | Назначение | Параметры |
|-----------|------------|-----------|
| `AuthModal` | Вход/регистрация | mode: "login" \| "register" |
| `SubscribeModal` | Оформление подписки | - |
| `PaymentModal` | Оплата | productId, priceId |
| `ConfirmModal` | Подтверждение действия | title, message, onConfirm |
| `FavoriteModal` | Добавление в избранное | contentId |

### 6.3 Компоненты страниц

#### Главная страница (`components/home/`)
| Компонент | Назначение |
|-----------|------------|
| `CourseCard.tsx` | Карточка курса |
| `ArticleCard.tsx` | Карточка статьи |
| `HeroSection.tsx` | Герой-секция |
| `FeaturesSection.tsx` | Секция особенностей |

#### Профиль (`app/(public)/profile/*/components/`)
| Компонент | Назначение |
|-----------|------------|
| `CourseList.tsx` | Список курсов пользователя |
| `CourseStats.tsx` | Статистика курсов |
| `Certificates.tsx` | Сертификаты |
| `ContinueLearning.tsx` | Продолжить обучение |
| `FavoritesGrid.tsx` | Сетка избранного |
| `CollectionsList.tsx` | Коллекции избранного |
| `ProfileForm.tsx` | Форма редактирования профиля |
| `AvatarUpload.tsx` | Загрузка аватара |
| `SocialLinks.tsx` | Социальные ссылки |
| `SubscriptionStatus.tsx` | Статус подписки |
| `PaymentHistory.tsx` | История платежей |
| `CancelSubscription.tsx` | Отмена подписки |

#### Админ-панель (`app/(protected)/admin/*/`)
| Компонент | Назначение |
|-----------|------------|
| `UserTable.tsx` | Таблица пользователей |
| `ContentTable.tsx` | Таблица контента |
| `ModerationQueue.tsx` | Очередь модерации |
| `StatsCards.tsx` | Карточки статистики |

---

## 7. Формы и валидация

### 7.1 Форма входа (`forms/auth/login.form.tsx`)

**HTML5 валидация:**
- `type="email"` — проверка формата email
- `isRequired` — обязательные поля

**Клиентская валидация:**
- Проверка email через regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Проверка заполнения пароля

**Серверная валидация:**
- Через NextAuth (credentials провайдер)

### 7.2 Форма регистрации (`forms/auth/registration.form.tsx`)

**HTML5 валидация:**
- `type="email"` — проверка формата email
- `isRequired` — обязательные поля

**Клиентская валидация:**
- Email regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Пароль: минимум 6 символов
- Подтверждение пароля: должно совпадать

**Серверная валидация:**
- Уникальность email
- Через `registerUser` action

### 7.3 Форма профиля (`app/(public)/profile/settings/components/ProfileForm.tsx`)

**Клиентская валидация:**
- firstName: обязательно
- lastName: обязательно
- nickname: обязательно, мин. 3 символа, только `a-zA-Z0-9_`
- displayName: обязательно
- bio: максимум 500 символов

**Серверная валидация:**
- Уникальность nickname
- Через API `/api/user/profile`

### 7.4 Формы калькуляторов

**Кредитный калькулятор (`calculator/credit/components/CreditForm.tsx`):**
- Сумма кредита: min 10,000, max 100,000,000
- Процентная ставка: min 1, max 50
- Срок: min 1, max 600 месяцев
- Тип платежа: аннуитетный/дифференцированный

**Калькулятор вкладов (`calculator/deposit/components/DepositForm.tsx`):**
- Сумма вклада: min 1,000, max 100,000,000
- Процентная ставка: min 0.1, max 30
- Срок: min 1, max 60 месяцев
- Капитализация: ежемесячно/ежеквартально/ежегодно/нет
- Ежемесячное пополнение: min 0

**Ипотечный калькулятор (`calculator/mortgage/components/MortgageForm.tsx`):**
- Сумма кредита: min 100,000, max 100,000,000
- Процентная ставка: min 1, max 30
- Срок: min 1, max 50 лет
- Первоначальный взнос: min 0, max 90%

---

## 8. Модальные окна

### 8.1 Система модальных окон

Проект использует централизованную систему модальных окон на основе:
- **Zustand** (`store/useModalStore.ts`) — глобальное состояние
- **ModalProvider** (`components/providers/ModalProvider.tsx`) — рендер активной модалки
- **ModalTrigger** (`components/common/modal-trigger.tsx`) — глобальный обработчик кликов

### 8.2 Доступные модальные окна

| Модалка | Назначение | Параметры |
|---------|------------|-----------|
| `auth` | Вход/регистрация | `mode`: "login" \| "register" |
| `subscribe` | Оформление подписки | - |
| `payment` | Оплата | `productId`, `priceId` |
| `confirm` | Подтверждение действия | `title`, `message`, `onConfirm` |
| `favorite` | Добавление в избранное | `contentId` |

### 8.3 Два способа открытия

**Напрямую через Zustand:**
```tsx
const { openModal } = useModalStore();
<button onClick={() => openModal('auth', { mode: 'login' })}>Войти</button>
```

**Через data-атрибуты (любой элемент):**
```tsx
<button data-open-modal="subscribe">Оформить подписку</button>
<button data-open-modal="payment" data-product-id="123">Купить</button>
```

---

## 9. Калькуляторы

### 9.1 Кредитный калькулятор

**Путь:** `/calculator/credit`

**Функциональность:**
- Расчёт ежемесячного платежа (аннуитетный/дифференцированный)
- График платежей
- Досрочное погашение
- Визуализация (график)

**Экспорт:**
- PDF (печать через window.print())

**Типы:**
```typescript
interface CreditInput {
  amount: number;        // Сумма кредита
  rate: number;          // Годовая ставка (%)
  term: number;          // Срок (месяцев)
  type: 'annuity' | 'differentiated';
  earlyRepayment?: {     // Досрочное погашение
    amount: number;
    month: number;
  };
}

interface CreditResult {
  monthlyPayment: number;      // Ежемесячный платеж
  totalPayment: number;        // Общая сумма выплат
  totalInterest: number;       // Общий процент
  schedule: CreditMonth[];     // График платежей
}
```

### 9.2 Калькулятор вкладов

**Путь:** `/calculator/deposit`

**Функциональность:**
- Расчёт с капитализацией и без
- Ежемесячное пополнение
- Частичное снятие
- Эффективная ставка
- Визуализация (график)

**Экспорт:**
- PDF (печать через window.print())
- CSV (скачивание файла)

**Типы:**
```typescript
interface DepositInput {
  initialAmount: number;        // Начальная сумма
  monthlyAddition: number;      // Ежемесячное пополнение
  interestRate: number;         // Годовая ставка (%)
  term: number;                 // Срок (месяцев)
  capitalization: CapitalizationPeriod;  // Период капитализации
  taxRate: TaxRate;             // Ставка налога
}

interface DepositResult {
  months: DepositMonth[];
  finalAmount: number;          // Сумма в конце срока
  totalInterest: number;        // Всего процентов
  totalTax: number;             // Налог
  effectiveRate: number;        // Эффективная ставка
}
```

### 9.3 Ипотечный калькулятор

**Путь:** `/calculator/mortgage`

**Функциональность:**
- Расчёт ипотечного платежа
- Первоначальный взнос
- График платежей
- Страховка (опционально)
- Визуализация (график)

**Экспорт:**
- PDF (печать через window.print())

---

## 10. Админ-панель

### 10.1 Страницы

| Страница | Путь | Функциональность |
|----------|------|------------------|
| Главная | `/admin` | Статистика (пользователи, контент, подписки) |
| Пользователи | `/admin/users` | Просмотр, редактирование роли, блокировка, удаление |
| Контент | `/admin/content` | Просмотр, удаление, фильтры |
| Модерация | `/admin/moderation` | Одобрение/отклонение контента |

### 10.2 Функциональность управления пользователями

- Просмотр списка с пагинацией
- Поиск по email/никнейму
- Фильтр по роли (USER/AUTHOR/MODERATOR/ADMIN)
- Редактирование роли
- Блокировка пользователя
- Удаление пользователя

### 10.3 Функциональность управления контентом

- Просмотр списка с пагинацией
- Поиск по названию
- Фильтр по типу (COURSE/ARTICLE/VIDEO/PODCAST)
- Фильтр по статусу (DRAFT/PENDING_REVIEW/PUBLISHED/ARCHIVED)
- Удаление контента

### 10.4 Модерация контента

- Просмотр контента на модерации
- Одобрение (approve)
- Отклонение (reject) с комментарием
- Приоритет модерации

---

## 11. Аутентификация

### 11.1 NextAuth v5 (Auth.js)

**Провайдеры:**
- Credentials (email/password)
- OAuth (Google, VK, Yandex, GitHub) — настроено, но не обязательно

**Конфигурация:**
- Файл: `auth/auth.ts`
- Сессия хранится в БД (Prisma adapter)
- JWT токены

### 11.2 Роли и права доступа

| Роль | Доступ |
|------|--------|
| USER | Личный кабинет, курсы, избранное, история |
| AUTHOR | + Создание контента, авторская панель |
| MODERATOR | + Модерация контента |
| ADMIN | + Полное управление пользователями и контентом |

### 11.3 Защита маршрутов

- Middleware: `proxy.ts` (кастомное имя)
- Защищённые маршруты: `/profile/*`, `/course/*`, `/lesson/*`, `/admin/*`, `/author/*`

---

## 12. Структура проекта

```
├── app/                         # Next.js App Router
│   ├── (public)/                # Публичные маршруты
│   │   ├── article/             # Статьи
│   │   ├── calculator/          # Калькуляторы
│   │   │   ├── credit/          # Кредитный
│   │   │   ├── deposit/         # Вкладов
│   │   │   └── mortgage/        # Ипотечный
│   │   ├── catalog/             # Каталог
│   │   ├── content/[slug]/      # Детальная страница контента
│   │   ├── faq/                 # Вопросы и ответы
│   │   ├── tools/               # Инструменты
│   │   ├── login/               # Вход
│   │   ├── register/            # Регистрация
│   │   └── profile/             # Личный кабинет
│   │       ├── courses/         # Мои курсы
│   │       ├── favorites/       # Избранное
│   │       ├── settings/        # Настройки
│   │       └── subscription/    # Подписка
│   ├── (protected)/             # Защищённые маршруты
│   │   ├── course/[slug]/       # Страница курса
│   │   ├── lesson/[slug]/       # Страница урока
│   │   ├── admin/               # Админ-панель
│   │   │   ├── users/           # Управление пользователями
│   │   │   ├── content/         # Управление контентом
│   │   │   └── moderation/      # Модерация
│   │   └── author/              # Панель автора
│   ├── api/                     # API роуты
│   │   ├── auth/                # Аутентификация
│   │   ├── content/             # Контент
│   │   ├── course/              # Курсы
│   │   ├── lesson/              # Уроки
│   │   ├── user/                # Пользователь
│   │   ├── reactions/           # Реакции
│   │   ├── payment/             # Платежи
│   │   ├── moderation/          # Модерация
│   │   └── admin/               # Администрирование
│   ├── layout.tsx               # Корневой layout
│   └── page.tsx                 # Главная страница
├── auth/                        # NextAuth конфигурация
├── components/                  # React компоненты
│   ├── common/                  # Переиспользуемые
│   ├── home/                    # Главная страница
│   ├── providers/               # Context провайдеры
│   └── UI/                      # UI компоненты
│       ├── layout/              # Layout компоненты
│       └── modals/              # Модальные окна
├── config/                      # Конфигурация сайта
├── forms/                       # Формы
│   └── auth/                    # Формы аутентификации
├── prisma/                      # База данных
│   ├── schema.prisma            # Схема БД
│   └── migrations/              # Миграции
├── public/                      # Статические файлы
│   ├── images/                  # Изображения
│   ├── favicon.svg              # Фавикон
│   ├── robots.txt               # Robots.txt
│   └── sitemap.xml              # Sitemap
├── store/                       # Zustand сторы
├── types/                       # TypeScript типы
└── utils/                       # Утилиты
```

---

## Цветовая палитра

Используется в `app/globals.css`:

```css
:root {
  --background: #F8F6F3;      /* Светлый фон */
  --foreground: #264653;      /* Основной текст */
  --primary: #F4A261;         /* Оранжевый */
  --secondary: #2A9D8F;       /* Бирюзовый */
  --accent: #F4A261;          /* Акцентный */
  --muted: #6C757D;           /* Приглушённый */
  --destructive: #FF6B6B;     /* Ошибка/удаление */
  --border: #E9ECEF;          /* Границы */
}
```

---

## Команды для работы

```bash
# Запуск dev-сервера
npm run dev

# Сборка проекта
npm run build

# Запуск продакшн-версии
npm run start

# Запуск линтера
npm run lint

# Применение миграций
npx prisma migrate dev

# Генерация Prisma Client
npx prisma generate

# Просмотр Studio
npx prisma studio

# Сидирование БД
npx prisma db seed
```

---

## Переменные окружения (.env)

```env
# База данных
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth провайдеры (опционально)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_VK_ID=""
AUTH_VK_SECRET=""
# и т.д.
```

---

## TODO / notes

- Авторизация через провайдеры (Google, VK, Yandex, GitHub) — НЕ требуется реализовывать
- Платёжная интеграция (ЮKassa) — только имитация для тестирования
- Приоритет стилей: макет из https://github.com/Cat-hippopatam/fin
- Деплой: Vercel с PostgreSQL (Prisma ORM)

---

*Документация создана на основе анализа исходного кода проекта Economikus*
*Версия: 1.0*
*Дата: 2025*
