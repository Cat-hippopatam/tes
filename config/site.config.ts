export const siteConfig = {
    title: "Экономикус - образовательная платформа",
    shortTitle: "Экономикус",
    description: "Образовательная платформа финансов и инвестиций. Учитесь инвестировать безопасно и с умом.",
    
    // Навигация
    // navItems: [
    //     { href: "/", label: "Главная" },
    //     { href: "/catalog", label: "Каталог" },
    //     { href: "/article", label: "Статьи" },
    //     { href: "/course", label: "Курсы" },
    //     { href: "/tools", label: "Инструменты" }
    // ],

    navigation: [
      { name: 'Калькуляторы', href: '/calculator' },
      { name: 'Статьи', href: '/article' },
      { name: 'Вопросы и ответы', href: '/faq' },
      { name: 'Курсы', href: '/catalog' },
    ],

    pagesContent: {
        "/": { label: "Тест",
            content: "<h1>Описание :</h1> дополниетльное, но возможно вырежу"
        },
        "/catalog": { label: "Тест 2",
            content: "<h1><b>Описание</b> :</h1> дополниетльное, но возможно вырежу"
        }
// предположительное распределение контента
    },

    // Пути для авторизации
    auth: {
        login: "/auth/login",
        register: "forms/auth/registration",
        logout: "/auth/logout",
        dashboard: "/dashboard"
    },

    // Социальные сети
    socialLinks: {
        telegram: "https://t.me/economikus",
        vk: "https://vk.com/economikus",
        youtube: "https://youtube.com/economikus"
    },

    // Контакты
    contacts: {
        email: "support@economikus.ru",
        support: "help@economikus.ru"
    },

    // Цветовая схема
    theme: {
        primary: "#457B9D",      // Глубокий синий
        accent: "#FFD166",        // Песочный
        secondary: "#7FB069",     // Мятно-серый
        text: {
            primary: "#1F2937",   // Темно-серый для текста
            secondary: "#6B7280", // Серый для второстепенного текста
            light: "#9CA3AF"      // Светло-серый
        }
    },

    // // Настройки навигации
    // navigation: {
    //     sticky: true,
    //     mobileBreakpoint: "sm",
    //     menuItems: [
    //         { href: "/catalog", label: "Каталог", requiresAuth: false },
    //         { href: "/article", label: "Статьи", requiresAuth: false },
    //         { href: "/course", label: "Курсы", requiresAuth: false },
    //         { href: "/tools", label: "Инструменты", requiresAuth: false },
    //         { href: "/dashboard", label: "Личный кабинет", requiresAuth: true }
    //     ]
    // }
} as const;

// export type SiteConfig = typeof siteConfig;

// const statusConfig = {
//   active: {
//     icon: CheckCircle,
//     color: "text-green-600 bg-green-50",
//     text: "Активна"
//   },
//   trialing: {
//     icon: Clock,
//     color: "text-blue-600 bg-blue-50",
//     text: "Пробный период"
//   },
//   past_due: {
//     icon: AlertCircle,
//     color: "text-red-600 bg-red-50",
//     text: "Просрочена"
//   },
//   canceled: {
//     icon: XCircle,
//     color: "text-gray-600 bg-gray-50",
//     text: "Отменена"
//   },
//   incomplete: {
//     icon: AlertTriangle,
//     color: "text-yellow-600 bg-yellow-50",
//     text: "Требуется оплата"
//   },
//   incomplete_expired: {
//     icon: XCircle,
//     color: "text-red-600 bg-red-50",
//     text: "Платеж не прошел"
//   },
//   unpaid: {
//     icon: AlertCircle,
//     color: "text-red-600 bg-red-50",
//     text: "Не оплачено"
//   }
// } as const;

// export type statusConfig = typeof statusConfig;