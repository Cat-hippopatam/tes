import { 
  mockPopularCourses, 
  mockArticles, 
  mockCalculators, 
  mockFeatures, 
  mockTestimonials 
} from '@/utils/lib/mock/home';
import type { Course, Article, Calculator, Feature, Testimonial } from '@/types/home';

// Пока используем только мок-данные
// Позже добавим Prisma запросы, когда будут созданы таблицы

export const homeService = {
  // Получение популярных курсов
  async getPopularCourses(limit: number = 6): Promise<Course[]> {
    // Здесь потом будет логика с Prisma
    // Сейчас просто возвращаем мок-данные
    return mockPopularCourses.slice(0, limit);
  },

  // Получение последних статей
  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    return mockArticles.slice(0, limit);
  },

  // Получение калькуляторов
  async getCalculators(): Promise<Calculator[]> {
    return mockCalculators;
  },

  // Получение преимуществ
  async getFeatures(): Promise<Feature[]> {
    return mockFeatures;
  },

  // Получение отзывов
  async getTestimonials(limit: number = 4): Promise<Testimonial[]> {
    return mockTestimonials.slice(0, limit);
  }
};