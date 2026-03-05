import { PrismaClient } from '@prisma/client';
import { 
  mockPopularCourses, 
  mockArticles, 
  mockCalculators, 
  mockFeatures, 
  mockTestimonials 
} from '@/utils/lib/mock/home';
import type { Course, Article, Calculator, Feature, Testimonial } from '@/types/home';

const prisma = new PrismaClient();

interface DataServiceOptions {
  useMock?: boolean; // Для тестирования можно принудительно использовать мок
}

class DataService {
  private useMock: boolean;

  constructor(options: DataServiceOptions = {}) {
    this.useMock = options.useMock || false;
  }

  // Проверка доступности БД (можно расширить)
  private async isDatabaseAvailable(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      console.warn('Database unavailable, using mock data');
      return false;
    }
  }

  // Получение популярных курсов
  async getPopularCourses(limit: number = 6): Promise<Course[]> {
    // Если принудительно используем мок или БД недоступна
    if (this.useMock || !(await this.isDatabaseAvailable())) {
      return mockPopularCourses.slice(0, limit);
    }

    try {
      // Пробуем получить из БД
      const courses = await prisma.course.findMany({
        where: { isPublished: true },
        take: limit,
        orderBy: { studentsCount: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          lessons: true,
          duration: true,
          level: true,
          price: true,
          isFree: true,
          rating: true,
          studentsCount: true,
          category: true,
          slug: true
        }
      });

      // Если в БД нет данных, используем мок
      if (!courses.length) {
        console.log('No courses in DB, using mock data');
        return mockPopularCourses.slice(0, limit);
      }

      // Преобразуем в нужный формат
      return courses.map(course => ({
        ...course,
        lessonsCount: course.lessons.length,
        duration: course.duration || '4 недели', // Значение по умолчанию
      }));
    } catch (error) {
      console.error('Error fetching courses from DB:', error);
      return mockPopularCourses.slice(0, limit);
    }
  }

  // Получение последних статей
  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    if (this.useMock || !(await this.isDatabaseAvailable())) {
      return mockArticles.slice(0, limit);
    }

    try {
      const articles = await prisma.article.findMany({
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          author: true
        }
      });

      if (!articles.length) {
        return mockArticles.slice(0, limit);
      }

      return articles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        image: article.image,
        author: article.author.name,
        authorAvatar: article.author.avatar,
        publishedAt: article.publishedAt.toISOString(),
        readTime: article.readTime,
        category: article.category,
        slug: article.slug
      }));
    } catch (error) {
      console.error('Error fetching articles from DB:', error);
      return mockArticles.slice(0, limit);
    }
  }

  // Получение калькуляторов (пока только мок, т.к. их нет в БД)
  async getCalculators(): Promise<Calculator[]> {
    return mockCalculators;
  }

  // Получение преимуществ (пока только мок)
  async getFeatures(): Promise<Feature[]> {
    return mockFeatures;
  }

  // Получение отзывов
  async getTestimonials(limit: number = 4): Promise<Testimonial[]> {
    if (this.useMock || !(await this.isDatabaseAvailable())) {
      return mockTestimonials.slice(0, limit);
    }

    try {
      const testimonials = await prisma.testimonial.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          course: true
        }
      });

      if (!testimonials.length) {
        return mockTestimonials.slice(0, limit);
      }

      return testimonials.map(t => ({
        id: t.id,
        name: t.user.name,
        avatar: t.user.avatar,
        role: t.user.role || 'Студент',
        content: t.content,
        rating: t.rating,
        courseName: t.course?.title
      }));
    } catch (error) {
      console.error('Error fetching testimonials from DB:', error);
      return mockTestimonials.slice(0, limit);
    }
  }
}

// Экспортируем singleton с настройками по умолчанию
export const dataService = new DataService();

// Для тестирования можно создать экземпляр с принудительным моком
export const createDataService = (options: DataServiceOptions) => new DataService(options);