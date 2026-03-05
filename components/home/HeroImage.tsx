'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export const HeroImage = () => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold mb-2">Управляй финансами</h3>
        <p className="text-gray-300">Планируй бюджет, инвестируй, копи</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto h-96">
      <Image
        src="/images/hero-illustration.svg"
        alt="Финансовая грамотность"
        fill
        className="object-contain"
        onError={() => setImageError(true)}
        priority
      />
    </div>
  );
};