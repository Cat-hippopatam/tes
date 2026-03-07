import { prisma } from '../prisma';

export const homeService = {
  async getPopularCourses(limit: number = 6) {
    const courses = await prisma.content.findMany({
      where: {
        type: 'COURSE',
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        viewsCount: 'desc',
      },
      take: limit,
    });

    return courses.map(course => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      coverImage: course.coverImage,
      difficultyLevel: course.difficultyLevel,
      isPremium: course.isPremium,
      author: course.author,
      viewsCount: course.viewsCount,
    }));
  },

  async getLatestArticles(limit: number = 4) {
    const articles = await prisma.content.findMany({
      where: {
        type: 'ARTICLE',
        status: 'PUBLISHED',
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return articles.map(article => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      description: article.description,
      coverImage: article.coverImage,
      publishedAt: article.publishedAt,
      author: article.author,
    }));
  },

  getCalculators() {
    return [
      { id: '1', title: 'Кредитный калькулятор', description: 'Рассчитайте платежи по кредиту', slug: 'credit', icon: '💳' },
      { id: '2', title: 'Калькулятор вкладов', description: 'Рассчитайте доходность вклада', slug: 'deposit', icon: '🏦' },
      { id: '3', title: 'Ипотечный калькулятор', description: 'Рассчитайте ипотеку', slug: 'mortgage', icon: '🏠' },
    ];
  },

  getFeatures() {
    return [
      { title: 'Эксперты', description: 'Обучаем у практиков финансового рынка', icon: '👨‍🏫' },
      { title: 'Практика', description: 'Закрепляем знания на реальных кейсах', icon: '💼' },
      { title: 'Сертификаты', description: 'Подтверждаем вашу квалификацию', icon: '📜' },
      { title: 'Сообщество', description: 'Общаемся с единомышленниками', icon: '👥' },
    ];
  },

  async getTestimonials(limit: number = 4) {
    // Пока возвращаем статические данные, так как таблицы отзывов нет в схеме
    // Можно расширить схему при необходимости
    return [
      { id: '1', name: 'Анна К.', text: 'Отличный курс! Всё понятно и доступно.', role: 'Студент' },
      { id: '2', name: 'Михаил П.', text: 'Получил реальные навыки инвестирования.', role: 'Предприниматель' },
      { id: '3', name: 'Елена С.', text: 'Рекомендую всем, кто хочет разобраться в финансах.', role: 'Менеджер' },
      { id: '4', name: 'Иван Д.', text: 'Лучший курс по финансовой грамотности!', role: 'Разработчик' },
    ];
  },
};
