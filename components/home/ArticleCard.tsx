import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/home';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const {
    title,
    excerpt,
    image,
    author,
    authorAvatar,
    publishedAt,
    readTime,
    category,
    slug
  } = article;

  const formattedDate = new Date(publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/articles/${slug}`}>
      <div className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative h-48 bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-[#264653] to-[#1a3a45] text-white">
              <span className="text-4xl">📄</span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-[#F4A261] text-white px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              {authorAvatar && (
                <Image
                  src={authorAvatar}
                  alt={author}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-[#264653]">{author}</div>
              <div className="text-xs text-[#6C757D]">{formattedDate}</div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-[#264653] mb-2 line-clamp-2">{title}</h3>
          <p className="text-[#6C757D] text-sm mb-4 line-clamp-2">{excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6C757D]">⏱ {readTime} мин чтения</span>
            <span className="text-[#F4A261] text-sm">Читать →</span>
          </div>
        </div>
      </div>
    </Link>
  );
};