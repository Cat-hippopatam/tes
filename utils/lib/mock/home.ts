import { Course, Article, Calculator, Feature, Testimonial } from '@/types/home';

// Популярные курсы
export const mockPopularCourses: Course[] = [
  {
    id: '1',
    title: 'Основы финансовой грамотности',
    description: 'Научитесь управлять личными финансами, составлять бюджет и избегать долгов',
    image: '/images/courses/finance-basics.jpg',
    lessonsCount: 24,
    duration: '6 недель',
    level: 'НАЧАЛЬНЫЙ',
    price: 0,
    isFree: true,
    rating: 4.8,
    studentsCount: 15420,
    category: 'Основы',
    slug: 'finance-basics'
  },
  {
    id: '2',
    title: 'Инвестиции для начинающих',
    description: 'Всё об инвестициях: акции, облигации, ETF и как начать инвестировать с малым капиталом',
    image: '/images/courses/investing.jpg',
    lessonsCount: 32,
    duration: '8 недель',
    level: 'СРЕДНИЙ',
    price: 2990,
    isFree: false,
    rating: 4.9,
    studentsCount: 8750,
    category: 'Инвестиции',
    slug: 'investing-basics'
  },
  {
    id: '3',
    title: 'Пенсионное планирование',
    description: 'Как обеспечить достойную пенсию и не зависеть от государства',
    image: '/images/courses/pension.jpg',
    lessonsCount: 18,
    duration: '4 недели',
    level: 'СРЕДНИЙ',
    price: 1990,
    isFree: false,
    rating: 4.7,
    studentsCount: 4320,
    category: 'Планирование',
    slug: 'pension-planning'
  },
  {
    id: '4',
    title: 'Налоговая грамотность',
    description: 'Налоговые вычеты, декларации и законная оптимизация налогов',
    image: '/images/courses/taxes.jpg',
    lessonsCount: 20,
    duration: '5 недель',
    level: 'ПРОДВИНУТЫЙ',
    price: 2490,
    isFree: false,
    rating: 4.6,
    studentsCount: 3180,
    category: 'Налоги',
    slug: 'tax-literacy'
  },
  {
    id: '5',
    title: 'Финансовая независимость',
    description: 'Путь к финансовой свободе: создание капитала и пассивного дохода',
    image: '/images/courses/freedom.jpg',
    lessonsCount: 28,
    duration: '7 недель',
    level: 'СРЕДНИЙ',
    price: 3490,
    isFree: false,
    rating: 4.9,
    studentsCount: 6240,
    category: 'Независимость',
    slug: 'financial-freedom'
  }
];

// Последние статьи
export const mockArticles: Article[] = [
  {
    id: '1',
    title: '10 финансовых привычек успешных людей',
    excerpt: 'Какие привычки помогут вам накопить капитал и достичь финансовых целей',
    image: '/images/articles/habits.jpg',
    author: 'Анна Петрова',
    authorAvatar: '/images/authors/anna.jpg',
    publishedAt: '2024-03-15',
    readTime: 5,
    category: 'Советы',
    slug: 'financial-habits'
  },
  {
    id: '2',
    title: 'Как составить личный финансовый план на 2024 год',
    excerpt: 'Пошаговое руководство по созданию финансового плана, который действительно работает',
    image: '/images/articles/plan.jpg',
    author: 'Михаил Иванов',
    authorAvatar: '/images/authors/mikhail.jpg',
    publishedAt: '2024-03-10',
    readTime: 8,
    category: 'Планирование',
    slug: 'financial-plan-2024'
  },
  {
    id: '3',
    title: 'Что такое сложный процент и как он делает вас богаче',
    excerpt: 'Разбираем магию сложного процента и почему важно начинать инвестировать рано',
    image: '/images/articles/compound.jpg',
    author: 'Елена Соколова',
    authorAvatar: '/images/authors/elena.jpg',
    publishedAt: '2024-03-05',
    readTime: 6,
    category: 'Инвестиции',
    slug: 'compound-interest'
  },
  {
    id: '4',
    title: 'Криптовалюты: возможности и риски',
    excerpt: 'Объективный взгляд на инвестиции в криптовалюты для начинающих',
    image: '/images/articles/crypto.jpg',
    author: 'Дмитрий Волков',
    authorAvatar: '/images/authors/dmitry.jpg',
    publishedAt: '2024-02-28',
    readTime: 7,
    category: 'Крипто',
    slug: 'crypto-basics'
  }
];

// Калькуляторы
export const mockCalculators: Calculator[] = [
  {
    id: '1',
    title: 'Ипотечный калькулятор',
    description: 'Рассчитайте ежемесячный платеж, переплату и график погашения ипотеки',
    icon: '🏠',
    color: '#F4A261',
    path: '/calculator/mortgage',
    isPopular: true
  },
  {
    id: '2',
    title: 'Кредитный калькулятор',
    description: 'Сравните условия кредитов и найдите оптимальный вариант',
    icon: '💳',
    color: '#2A9D8F',
    path: '/calculator/credit',
    isPopular: false
  },
  {
    id: '3',
    title: 'Депозитный калькулятор',
    description: 'Рассчитайте доходность вклада с учетом капитализации процентов',
    icon: '💰',
    color: '#264653',
    path: '/calculator/deposit',
    isPopular: true
  }
];

// Преимущества
export const mockFeatures: Feature[] = [
  {
    id: '1',
    title: 'Экспертные знания',
    description: 'Курсы разработаны практикующими финансистами с опытом 10+ лет',
    icon: '🎓',
    color: '#F4A261'
  },
  {
    id: '2',
    title: 'Практические навыки',
    description: 'Реальные кейсы, калькуляторы и инструменты для повседневного использования',
    icon: '💪',
    color: '#2A9D8F'
  },
  {
    id: '3',
    title: 'Доступно 24/7',
    description: 'Учитесь в любое время с любого устройства. Все материалы всегда под рукой',
    icon: '🌐',
    color: '#264653'
  },
  {
    id: '4',
    title: 'Сертификаты',
    description: 'Подтвердите свои знания сертификатом государственного образца',
    icon: '📜',
    color: '#F4A261'
  },
  {
    id: '5',
    title: 'Сообщество',
    description: 'Общайтесь с единомышленниками, делитесь опытом и находите ответы',
    icon: '👥',
    color: '#2A9D8F'
  },
  {
    id: '6',
    title: 'Бесплатные материалы',
    description: 'Много бесплатных уроков, статей и инструментов для старта',
    icon: '🎁',
    color: '#264653'
  }
];

// Отзывы
export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Алексей Константинов',
    avatar: '/images/testimonials/alexey.jpg',
    role: 'Начинающий инвестор',
    content: 'Курс "Инвестиции для начинающих" полностью изменил мое отношение к деньгам. Через 3 месяца после начала обучения я открыл ИИС и купил первые акции. Спасибо команде!',
    rating: 5,
    courseName: 'Инвестиции для начинающих'
  },
  {
    id: '2',
    name: 'Екатерина Смирнова',
    avatar: '/images/testimonials/ekaterina.jpg',
    role: 'Предприниматель',
    content: 'Очень структурированный подход. Все разложено по полочкам, сложные вещи объясняются простым языком. Калькуляторы особенно порадовали - теперь планирую бюджет за 5 минут!',
    rating: 5,
    courseName: 'Основы финансовой грамотности'
  },
  {
    id: '3',
    name: 'Денис Морозов',
    avatar: '/images/testimonials/denis.jpg',
    role: 'IT-специалист',
    content: 'Давно искал качественный курс по налогам. Здесь нашел всё, что нужно: и теорию, и практические примеры, и налоговые калькуляторы. Очень доволен!',
    rating: 4,
    courseName: 'Налоговая грамотность'
  }
];