'use client';

import React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    description?: string | null;
    publishedAt?: string | Date | null;
    coverImage?: string | null;
    slug?: string;
    author?: {
      displayName?: string | null;
    };
  };
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt as string).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  const href = article.slug ? `/article/${article.slug}` : `/content/${article.id}`;

  return (
    <Link href={href}>
      <div className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="h-48 bg-gray-200 flex items-center justify-center bg-gradient-to-br from-[#2A9D8F] to-[#264653]">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">📄</span>
          )}
        </div>
        <div className="p-5">
          {formattedDate && (
            <div className="text-xs text-[#6C757D] mb-2">{formattedDate}</div>
          )}
          <h3 className="text-lg font-bold text-[#264653] mb-2 line-clamp-2">{article.title}</h3>
          {article.description && (
            <p className="text-[#6C757D] text-sm mb-4 line-clamp-2">{article.description}</p>
          )}
          <span className="text-[#F4A261] text-sm">Читать →</span>
        </div>
      </div>
    </Link>
  );
};