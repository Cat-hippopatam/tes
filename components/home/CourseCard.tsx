'use client';

import React from 'react';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string | null;
    coverImage?: string | null;
    difficultyLevel?: string | null;
    isPremium?: boolean;
    slug?: string;
  };
  variant?: 'default' | 'compact';
}

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Начинающий',
  INTERMEDIATE: 'Средний',
  ADVANCED: 'Продвинутый',
};

export const CourseCard = ({ course, variant = 'default' }: CourseCardProps) => {
  const levelLabel = course.difficultyLevel ? difficultyLabels[course.difficultyLevel] : 'Начинающий';
  const href = course.slug ? `/course/${course.slug}` : `/content/${course.id}`;

  return (
    <Link href={href}>
      <div className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 bg-gray-200">
          {course.coverImage ? (
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#457B9D] to-[#2A9D8F]">
              <span className="text-4xl">📚</span>
            </div>
          )}
          {course.isPremium && (
            <div className="absolute top-4 right-4 bg-[#F4A261] text-white px-3 py-1 rounded-full text-sm font-medium">
              Premium
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-[#6C757D]">{levelLabel}</span>
          </div>
          <h3 className="text-lg font-bold text-[#264653] mb-2 line-clamp-2">{course.title}</h3>
          {variant === 'default' && course.description && (
            <p className="text-[#6C757D] text-sm mb-4 line-clamp-2">{course.description}</p>
          )}
          <div className="flex items-center justify-between">
            <button className="text-[#F4A261] hover:text-[#e08e4a] font-medium text-sm">
              Подробнее →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};