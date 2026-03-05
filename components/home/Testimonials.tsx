'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types/home';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#264653] mb-4">
            Что говорят наши студенты
          </h2>
          <p className="text-xl text-[#6C757D] max-w-2xl mx-auto">
            Более 15 000 студентов уже улучшили свою финансовую грамотность
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Карусель */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full shrink-0 px-4">
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-lg text-[#264653] mb-6 italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
                        {testimonial.avatar && (
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#264653]">{testimonial.name}</h4>
                        <p className="text-sm text-[#6C757D]">{testimonial.role}</p>
                        {testimonial.courseName && (
                          <p className="text-xs text-[#F4A261] mt-1">{testimonial.courseName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Кнопки навигации */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#264653] hover:text-[#F4A261] transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#264653] hover:text-[#F4A261] transition-colors"
          >
            →
          </button>

          {/* Индикаторы */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-[#F4A261] w-8' 
                    : 'bg-[#6C757D] hover:bg-[#F4A261]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};