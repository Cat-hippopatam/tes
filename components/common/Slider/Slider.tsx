'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
  formatLabel?: (value: number) => string;
}

export function Slider({ 
  min, 
  max, 
  step, 
  value, 
  onChange, 
  className = '',
  disabled = false,
  formatLabel
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    let newPercentage = (x / width) * 100;
    newPercentage = Math.max(0, Math.min(100, newPercentage));
    
    const rawValue = min + (newPercentage / 100) * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const clampedValue = Math.min(max, Math.max(min, steppedValue));
    
    onChange(clampedValue);
  }, [isDragging, min, max, step, onChange, disabled]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={sliderRef}
      className={`relative h-2 bg-gray-200 rounded-full cursor-pointer ${className}`}
      onMouseDown={(e) => {
        if (disabled) return;
        setIsDragging(true);
        const rect = sliderRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const width = rect.width;
          let newPercentage = (x / width) * 100;
          newPercentage = Math.max(0, Math.min(100, newPercentage));
          
          const rawValue = min + (newPercentage / 100) * (max - min);
          const steppedValue = Math.round(rawValue / step) * step;
          const clampedValue = Math.min(max, Math.max(min, steppedValue));
          
          onChange(clampedValue);
        }
      }}
    >
      {/* Прогресс */}
      <div 
        className="absolute h-full bg-[#F4A261] rounded-full"
        style={{ width: `${percentage}%` }}
      />
      
      {/* Ползунок */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#F4A261] rounded-full shadow-md hover:scale-110 transition-transform ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
        style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
      />
      
      {/* Подписи min/max */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatLabel ? formatLabel(min) : min.toLocaleString('ru-RU')}</span>
        <span>{formatLabel ? formatLabel(max) : max.toLocaleString('ru-RU')}</span>
      </div>
    </div>
  );
}