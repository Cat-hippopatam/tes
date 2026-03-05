export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  lessonsCount: number;
  duration: string;
  level: 'НАЧАЛЬНЫЙ' | 'СРЕДНИЙ' | 'ПРОДВИНУТЫЙ';
  price: number;
  isFree: boolean;
  rating: number;
  studentsCount: number;
  category: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  category: string;
  slug: string;
}

export interface Calculator {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  isPopular?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
  courseName?: string;
}