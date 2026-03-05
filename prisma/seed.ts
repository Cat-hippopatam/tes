// prisma/seed.ts
import { PrismaClient, Role, ContentType, ContentStatus, DifficultyLevel, SubscriptionStatus, TransactionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Добавим проверку наличия DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  console.log('Please create a .env file with: DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/economikus"')
  process.exit(1)
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  console.log('📦 Using database:', process.env.DATABASE_URL)

  try {
    // Clean up existing data
    console.log('🧹 Cleaning existing data...')
    
    await prisma.$executeRaw`TRUNCATE TABLE "Certificate" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Notification" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "ModerationItem" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "BusinessEvent" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "PaymentMethod" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Subscription" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Progress" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "History" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Favorite" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "CommentReaction" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "ContentReaction" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Comment" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Attachment" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "TagContent" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Module" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Content" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Tag" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Profile" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Account" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Session" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "Authenticator" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "VerificationToken" CASCADE;`
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`

    console.log('✅ Cleaned existing data')

    // ============================================
    // 1. Create User and Profile
    // ============================================
    
    const passwordHash = await bcrypt.hash('password123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'demo@economikus.ru',
        firstName: 'Александр',
        lastName: 'Иванов',
        passwordHash,
        role: Role.USER,
        profile: {
          create: {
            nickname: 'alexivanov',
            displayName: 'Александр Иванов',
            avatarUrl: '/images/avatars/default.jpg',
            coverImage: '/images/covers/default.jpg',
            bio: 'Интересуюсь инвестициями и финансовой грамотностью',
            website: 'https://example.com',
            telegram: '@alexivanov',
          }
        }
      },
      include: {
        profile: true
      }
    })

    console.log(`✅ Created user: ${user.email}`)

    // ============================================
    // 2. Create Tags
    // ============================================
    
    const tags = await Promise.all([
      prisma.tag.create({ data: { name: 'Инвестиции', slug: 'investitsii', color: '#F4A261', description: 'Статьи об инвестировании' } }),
      prisma.tag.create({ data: { name: 'Недвижимость', slug: 'nedvizhimost', color: '#2A9D8F', description: 'Всё о недвижимости' } }),
      prisma.tag.create({ data: { name: 'Пенсия', slug: 'pensiya', color: '#264653', description: 'Пенсионные накопления' } }),
      prisma.tag.create({ data: { name: 'Бюджет', slug: 'byudzhet', color: '#E76F51', description: 'Управление бюджетом' } }),
      prisma.tag.create({ data: { name: 'Криптовалюта', slug: 'kriptovalyuta', color: '#9B59B6', description: 'Криптовалюты и блокчейн' } }),
    ])

    console.log(`✅ Created ${tags.length} tags`)

    // ============================================
    // 3. Create Courses
    // ============================================
    
    const course1 = await prisma.content.create({
      data: {
        type: ContentType.COURSE,
        title: 'Основы финансовой грамотности',
        slug: 'osnovy-finansovoy-gramotnosti',
        description: 'Научитесь управлять личными финансами, составлять бюджет и планировать расходы',
        body: '<h1>О курсе</h1><p>Этот курс научит вас основам управления личными финансами...</p>',
        coverImage: '/images/courses/finance-basics.jpg',
        difficultyLevel: DifficultyLevel.BEGINNER,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: false,
        authorProfileId: user.profile!.id,
        viewsCount: 1250,
        likesCount: 89,
        favoritesCount: 156,
      }
    })

    const course2 = await prisma.content.create({
      data: {
        type: ContentType.COURSE,
        title: 'Инвестиции для начинающих',
        slug: 'investitsii-dlya-nachinayushchikh',
        description: 'Разберитесь в основах инвестирования: акции, облигации, ETF и диверсификация',
        body: '<h1>О курсе</h1><p>Курс для начинающих инвесторов...</p>',
        coverImage: '/images/courses/investing.jpg',
        difficultyLevel: DifficultyLevel.BEGINNER,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: true,
        authorProfileId: user.profile!.id,
        viewsCount: 2340,
        likesCount: 167,
        favoritesCount: 289,
      }
    })

    const course3 = await prisma.content.create({
      data: {
        type: ContentType.COURSE,
        title: 'Налоговая грамотность',
        slug: 'nalogovaya-gramotnost',
        description: 'Как законно экономить на налогах, оформлять вычеты и подавать декларации',
        body: '<h1>О курсе</h1><p>Узнайте всё о налогах...</p>',
        coverImage: '/images/courses/taxes.jpg',
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: true,
        authorProfileId: user.profile!.id,
        viewsCount: 890,
        likesCount: 45,
        favoritesCount: 78,
      }
    })

    const course4 = await prisma.content.create({
      data: {
        type: ContentType.COURSE,
        title: 'Пенсионные накопления',
        slug: 'pensionnye-nakopleniya',
        description: 'Как обеспечить достойную пенсию и использовать государственные программы',
        body: '<h1>О курсе</h1><p>Планирование пенсии...</p>',
        coverImage: '/images/courses/pension.jpg',
        difficultyLevel: DifficultyLevel.INTERMEDIATE,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        isPremium: false,
        authorProfileId: user.profile!.id,
        viewsCount: 567,
        likesCount: 34,
        favoritesCount: 45,
      }
    })

    console.log(`✅ Created ${4} courses`)

    // ============================================
    // 4. Create Modules
    // ============================================
    
    const modules = await Promise.all([
      // Course 1 modules
      prisma.module.create({ data: { courseId: course1.id, title: 'Введение в финансовую грамотность', description: 'Базовые понятия', sortOrder: 0, isPublished: true, lessonsCount: 2 } }),
      prisma.module.create({ data: { courseId: course1.id, title: 'Управление бюджетом', description: 'Как составить и контролировать бюджет', sortOrder: 1, isPublished: true, lessonsCount: 3 } }),
      prisma.module.create({ data: { courseId: course1.id, title: 'Сбережения и инвестиции', description: 'Основы инвестирования', sortOrder: 2, isPublished: true, lessonsCount: 3 } }),
      
      // Course 2 modules
      prisma.module.create({ data: { courseId: course2.id, title: 'Что такое инвестиции', description: 'Базовые понятия', sortOrder: 0, isPublished: true, lessonsCount: 2 } }),
      prisma.module.create({ data: { courseId: course2.id, title: 'Акции и облигации', description: 'Виды ценных бумаг', sortOrder: 1, isPublished: true, lessonsCount: 4 } }),
      prisma.module.create({ data: { courseId: course2.id, title: 'Диверсификация', description: 'Распределение рисков', sortOrder: 2, isPublished: true, lessonsCount: 4 } }),
      
      // Course 3 modules
      prisma.module.create({ data: { courseId: course3.id, title: 'Основы налогообложения', description: 'Базовые понятия', sortOrder: 0, isPublished: true, lessonsCount: 4 } }),
      prisma.module.create({ data: { courseId: course3.id, title: 'Налоговые вычеты', description: 'Как получить вычеты', sortOrder: 1, isPublished: true, lessonsCount: 4 } }),
      prisma.module.create({ data: { courseId: course3.id, title: 'Декларация 3-НДФЛ', description: 'Заполнение декларации', sortOrder: 2, isPublished: true, lessonsCount: 4 } }),
      
      // Course 4 modules
      prisma.module.create({ data: { courseId: course4.id, title: 'Пенсионная система РФ', description: 'Как устроена пенсия', sortOrder: 0, isPublished: true, lessonsCount: 2 } }),
      prisma.module.create({ data: { courseId: course4.id, title: 'НПФ и инвестиции', description: 'Негосударственное пенсионное обеспечение', sortOrder: 1, isPublished: true, lessonsCount: 4 } }),
    ])

    console.log(`✅ Created ${modules.length} modules`)

    // ============================================
    // 5. Create Lessons
    // ============================================
    
    const course1Modules = await prisma.module.findMany({ where: { courseId: course1.id }, orderBy: { sortOrder: 'asc' } })
    
    const lessons = await Promise.all([
      // Course 1 lessons
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Что такое финансовая грамотность', slug: 'chto-takoe-finansovaya-gramotnost', description: 'Введение в тему', moduleId: course1Modules[0].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 0 } }),
      prisma.content.create({ data: { type: ContentType.VIDEO, title: 'Почему важно управлять деньгами', slug: 'pochemu-vazhno-upravlyat-dengami', description: 'Мотивационное видео', videoUrl: 'https://youtube.com/watch?v=abc', videoProvider: 'YOUTUBE', videoDuration: 600, moduleId: course1Modules[0].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 1 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Как вести бюджет', slug: 'kak-vesti-byudzhet', description: 'Методы ведения бюджета', moduleId: course1Modules[1].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 0 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: '50/30/20 правило', slug: '50-30-20-pravilo', description: 'Простое правило бюджета', moduleId: course1Modules[1].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 1 } }),
      prisma.content.create({ data: { type: ContentType.VIDEO, title: 'Практика составления бюджета', slug: 'praktika-sostavleniya-byudzheta', description: 'Видео-практикум', videoUrl: 'https://youtube.com/watch?v=def', videoProvider: 'YOUTUBE', videoDuration: 1200, moduleId: course1Modules[1].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 2 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Виды сбережений', slug: 'vidy-sberezheniy', description: 'Обзор инструментов', moduleId: course1Modules[2].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 0 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Введение в инвестиции', slug: 'vvod-v-investitsii', description: 'Первые шаги', moduleId: course1Modules[2].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 1 } }),
      prisma.content.create({ data: { type: ContentType.VIDEO, title: 'Инвестиционные инструменты', slug: 'investitsionnye-instrumenty', description: 'Обзор инструментов', videoUrl: 'https://youtube.com/watch?v=ghi', videoProvider: 'YOUTUBE', videoDuration: 1800, moduleId: course1Modules[2].id, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), sortOrder: 2 } }),
    ])

    console.log(`✅ Created ${lessons.length} lessons`)

    // ============================================
    // 6. Create other Content
    // ============================================
    
    const articles = await Promise.all([
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: '10 ошибок инвестора', slug: '10-oshibok-investora', description: 'Частые ошибки новичков и как их избежать', coverImage: '/images/articles/investor-errors.jpg', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 450, likesCount: 78 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Как выбрать квартиру', slug: 'kak-vybrat-kvartiru', description: 'Полное руководство по выбору недвижимости', coverImage: '/images/articles/choose-apartment.jpg', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 320, likesCount: 45 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'ИИС или брокерский счёт', slug: 'is-i-brokership-schyot', description: 'Сравнение инвестиционных инструментов', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 210, likesCount: 34 } }),
    ])

    const videos = await Promise.all([
      prisma.content.create({ data: { type: ContentType.VIDEO, title: 'Как купить квартиру в ипотеку', slug: 'kak-kupit-kvartiru-v-ipoteku', description: 'Видео-урок по оформлению ипотеки', videoUrl: 'https://youtube.com/watch?v=mortgage1', videoProvider: 'YOUTUBE', videoDuration: 2400, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 890, likesCount: 123 } }),
      prisma.content.create({ data: { type: ContentType.VIDEO, title: 'Обзор налоговых вычетов 2024', slug: 'obzor-nalogovykh-vychetov-2024', description: 'Что изменилось в этом году', videoUrl: 'https://youtube.com/watch?v=taxes2024', videoProvider: 'YOUTUBE', videoDuration: 1200, authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 567, likesCount: 89 } }),
    ])

    const calculators = await Promise.all([
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Ипотечный калькулятор', slug: 'ipoteka-calculator', description: 'Расчёт ипотеки с досрочным погашением', body: '{"type": "mortgage"}', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 1200, likesCount: 45 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Кредитный калькулятор', slug: 'credit-calculator', description: 'Расчёт платежей по кредиту', body: '{"type": "credit"}', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 980, likesCount: 34 } }),
      prisma.content.create({ data: { type: ContentType.ARTICLE, title: 'Депозитный калькулятор', slug: 'deposit-calculator', description: 'Расчёт доходности вклада', body: '{"type": "deposit"}', authorProfileId: user.profile!.id, status: ContentStatus.PUBLISHED, publishedAt: new Date(), viewsCount: 750, likesCount: 28 } }),
    ])

    console.log(`✅ Created ${articles.length} articles, ${videos.length} videos, ${calculators.length} calculators`)

    // ============================================
    // 7. Create Progress
    // ============================================
    
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15)
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 20)

    const progress = await Promise.all([
      prisma.progress.create({
        data: {
          profileId: user.profile!.id,
          contentId: course1.id,
          status: 'in_progress',
          progressPercent: 75,
          completedLessons: 6,
          totalLessons: 8,
          startedAt: twoMonthsAgo,
          lastViewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        }
      }),
      prisma.progress.create({
        data: {
          profileId: user.profile!.id,
          contentId: course2.id,
          status: 'in_progress',
          progressPercent: 30,
          completedLessons: 3,
          totalLessons: 10,
          startedAt: lastMonth,
          lastViewedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        }
      }),
      prisma.progress.create({
        data: {
          profileId: user.profile!.id,
          contentId: course3.id,
          status: 'completed',
          progressPercent: 100,
          completedLessons: 12,
          totalLessons: 12,
          startedAt: twoMonthsAgo,
          completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          lastViewedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        }
      }),
      prisma.progress.create({
        data: {
          profileId: user.profile!.id,
          contentId: course4.id,
          status: 'not_started',
          progressPercent: 0,
          completedLessons: 0,
          totalLessons: 6,
          startedAt: null,
          lastViewedAt: now,
        }
      }),
    ])

    console.log(`✅ Created progress for ${progress.length} courses`)

    // Create Certificate for completed course
    await prisma.certificate.create({
      data: {
        profileId: user.profile!.id,
        contentId: course3.id,
        issuedAt: new Date(),
        completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        imageUrl: '/certificates/investing-basics.png',
        pdfUrl: '/certificates/investing-basics.pdf',
        certificateNumber: `CERT-${Date.now()}`,
        metadata: {
          studentName: user.profile!.displayName,
          courseName: course3.title,
          completionDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    })

    // ============================================
    // 8. Create Favorites
    // ============================================
    
    const favorites = await Promise.all([
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: course2.id, note: 'Обязательно повторить раздел про облигации', collection: 'Инвестиции' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: course4.id, collection: 'Пенсия' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: articles[0].id, collection: 'Инвестиции' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: articles[1].id, collection: 'Недвижимость' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: articles[2].id, collection: 'Инвестиции' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: videos[0].id, collection: 'Недвижимость' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: calculators[0].id, collection: 'Недвижимость' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: calculators[1].id, collection: 'Кредиты' } }),
      prisma.favorite.create({ data: { profileId: user.profile!.id, contentId: calculators[2].id, collection: 'Инвестиции' } }),
    ])

    console.log(`✅ Created ${favorites.length} favorites`)

    // ============================================
    // 9. Create Subscription
    // ============================================
    
    const subscription = await prisma.subscription.create({
      data: {
        profileId: user.profile!.id,
        planType: 'yearly',
        status: SubscriptionStatus.ACTIVE,
        startDate: twoMonthsAgo,
        endDate: new Date(twoMonthsAgo.getTime() + 365 * 24 * 60 * 60 * 1000),
        autoRenew: true,
        price: 2490,
        currency: 'RUB',
        provider: 'yookassa',
        providerSubscriptionId: 'sub_demo_123456',
      }
    })

    console.log(`✅ Created subscription: ${subscription.status}`)

    // ============================================
    // 10. Create Transactions
    // ============================================
    
    const transactions = await Promise.all([
      prisma.transaction.create({
        data: {
          profileId: user.profile!.id,
          subscriptionId: subscription.id,
          type: 'subscription',
          amount: 2490,
          currency: 'RUB',
          status: TransactionStatus.COMPLETED,
          provider: 'yookassa',
          providerPaymentId: 'pay_demo_001',
          completedAt: twoMonthsAgo,
          createdAt: twoMonthsAgo,
        }
      }),
      prisma.transaction.create({
        data: {
          profileId: user.profile!.id,
          subscriptionId: subscription.id,
          type: 'subscription',
          amount: 2490,
          currency: 'RUB',
          status: TransactionStatus.COMPLETED,
          provider: 'yookassa',
          providerPaymentId: 'pay_demo_002',
          completedAt: lastMonth,
          createdAt: lastMonth,
        }
      }),
      prisma.transaction.create({
        data: {
          profileId: user.profile!.id,
          subscriptionId: subscription.id,
          type: 'subscription',
          amount: 2490,
          currency: 'RUB',
          status: TransactionStatus.COMPLETED,
          provider: 'yookassa',
          providerPaymentId: 'pay_demo_003',
          completedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
          createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        }
      }),
    ])

    console.log(`✅ Created ${transactions.length} transactions`)

    // ============================================
    // 11. Create History
    // ============================================
    
    const history = await Promise.all([
      prisma.history.create({ data: { profileId: user.profile!.id, contentId: course1.id, viewedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), completed: true } }),
      prisma.history.create({ data: { profileId: user.profile!.id, contentId: lessons[0].id, viewedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), completed: true } }),
      prisma.history.create({ data: { profileId: user.profile!.id, contentId: calculators[0].id, viewedAt: now, completed: false } }),
    ])

    console.log(`✅ Created ${history.length} history items`)

    // Create Comment
    await prisma.comment.create({
      data: {
        contentId: course2.id,
        authorProfileId: user.profile!.id,
        text: 'Отличный курс! Очень помог разобраться в инвестициях.',
        status: 'APPROVED'
      }
    })

    // ============================================
    // Summary
    // ============================================
    
    console.log(`
  🎉 Seed completed successfully!
  
  📊 Summary:
  - User: ${user.email} (password: password123)
  - Profile: ${user.profile!.nickname}
  - Courses: 4 (with modules and lessons)
  - Articles: ${articles.length}
  - Videos: ${videos.length}
  - Calculators: ${calculators.length}
  - Favorites: ${favorites.length}
  - Progress: ${progress.length} entries
  - Subscription: ${subscription.status}
  - Transactions: ${transactions.length}
    `)

  } catch (error) {
    console.error('❌ Error during seed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })