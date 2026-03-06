'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/home';

interface CourseCardProps {
  course: Course;
  variant?: 'default' | 'compact';
}

export const CourseCard = ({ course, variant = 'default' }: CourseCardProps) => {
  const {
    title,
    description,
    image,
    lessonsCount,
    duration,
    level,
    price,
    isFree,
    rating,
    studentsCount,
    slug
  } = course;

  return (
    <Link href={`/courses/${slug}`}>
      <div className="bg-[#F8F9FA] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={(e) => {
                // При ошибке загрузки показываем дефолтную картинку
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#457B9D] to-[#2A9D8F]">
              <span className="text-4xl">📚</span>
            </div>
          )}
          {isFree && (
            <div className="absolute top-4 right-4 bg-[#2A9D8F] text-white px-3 py-1 rounded-full text-sm font-medium">
              Бесплатно
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-[#6C757D]">{level}</span>
            <span className="w-1 h-1 bg-[#6C757D] rounded-full"></span>
            <span className="text-xs font-medium text-[#6C757D]">{duration}</span>
          </div>
          <h3 className="text-lg font-bold text-[#264653] mb-2 line-clamp-2">{title}</h3>
          {variant === 'default' && (
            <p className="text-[#6C757D] text-sm mb-4 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-[#264653]">{rating}</span>
              <span className="text-xs text-[#6C757D]">({studentsCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#6C757D]">
              <span>📚 {lessonsCount} уроков</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {isFree ? (
                <span className="text-[#2A9D8F] font-bold">Бесплатно</span>
              ) : (
                <span className="text-[#F4A261] font-bold">{price.toLocaleString()} ₽</span>
              )}
            </div>
            <button className="text-[#F4A261] hover:text-[#e08e4a] font-medium text-sm">
              Подробнее →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};