'use client';

import { useRef } from 'react';

interface ProductGalleryProps {
  images: string[];
  title: string;
  isBestseller: boolean;
}

export function ProductGallery({ images, title, isBestseller }: ProductGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-chocolate/5 border border-chocolate/10 flex items-center justify-center text-chocolate/30 font-sans text-sm">
        Нет фотографии
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-square">
        <img src={images[0]} alt={title} className="w-full h-full object-cover border border-chocolate/10 shadow-sm" />
        {isBestseller && (
          <span className="absolute left-6 top-6 bg-chocolate/90 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold z-10">
            Бестселлер
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div 
        ref={scrollRef} 
        className="w-full aspect-square flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth border border-chocolate/10 shadow-sm"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((url, index) => (
          <div key={index} className="w-full aspect-square flex-shrink-0 snap-start snap-always relative">
            <img src={url} alt={`${title} - ракурс ${index + 1}`} className="w-full h-full object-cover" />
            {isBestseller && index === 0 && (
              <span className="absolute left-6 top-6 bg-chocolate/90 px-4 py-2 font-sans text-xs uppercase tracking-widest text-gold z-10">
                Бестселлер
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* ⚡️ Стрелки теперь всегда видны на ПК */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-cream/90 backdrop-blur text-chocolate rounded-full items-center justify-center shadow-md hover:bg-cream hover:scale-110 transition-all hidden md:flex text-xl z-20"
      >←</button>
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-cream/90 backdrop-blur text-chocolate rounded-full items-center justify-center shadow-md hover:bg-cream hover:scale-110 transition-all hidden md:flex text-xl z-20"
      >→</button>

      <div className="absolute bottom-4 right-4 bg-chocolate/80 text-cream px-3 py-1 text-xs font-sans uppercase tracking-wider backdrop-blur-sm rounded pointer-events-none md:hidden shadow-sm z-20">
        Листайте ↔
      </div>
    </div>
  );
}