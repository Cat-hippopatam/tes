import { 
  mockPopularCourses, 
  mockArticles, 
  mockCalculators, 
  mockFeatures, 
  mockTestimonials 
} from '@/utils/lib/mock/home';
import type { Course, Article, Calculator, Feature, Testimonial } from '@/types/home';

interface DataServiceOptions {
  useMock?: boolean;
}

// DataService - упрощённая версия, использующая моковые данные
// Реальное получение данных происходит через API роуты
class DataService {
  // Получение популярных курсов
  async getPopularCourses(limit: number = 6): Promise<Course[]> {
    return mockPopularCourses.slice(0, limit);
  }

  // Получение последних статей
  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    return mockArticles.slice(0, limit);
  }

  // Получение калькуляторов
  async getCalculators(): Promise<Calculator[]> {
    return mockCalculators;
  }

  // Получение преимуществ
  async getFeatures(): Promise<Feature[]> {
    return mockFeatures;
  }

  // Получение отзывов
  async getTestimonials(limit: number = 4): Promise<Testimonial[]> {
    return mockTestimonials.slice(0, limit);
  }
}

// Экспортируем singleton
export const dataService = new DataService();

// Для тестирования можно создать экземпляр
export const createDataService = (_options?: DataServiceOptions) => new DataService();