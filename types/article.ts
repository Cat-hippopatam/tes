export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  category: string;
  slug: string;
  tags?: string[];
}