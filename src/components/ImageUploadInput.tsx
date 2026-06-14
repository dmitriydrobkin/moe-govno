'use client';

import { useState } from 'react';

export function ImageUploadInput() {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 10) {
      alert('Максимум 10 фотографий!');
      e.target.value = ''; // Сбрасываем инпут
      setPreviews([]);
      return;
    }
    
    // Создаем временные ссылки для превью
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  return (
    <div className="mb-8 p-6 border border-dashed border-chocolate/30 bg-chocolate/5 transition-colors hover:bg-chocolate/10">
      <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
        Фотографии товара (до 10 шт.)
      </label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="w-full text-sm text-chocolate/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-chocolate file:text-cream hover:file:bg-chocolate/90 cursor-pointer"
      />
      
      {/* Сетка с превьюшками */}
      {previews.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {previews.map((src, idx) => (
            <div key={idx} className="relative w-16 h-16 border border-chocolate/20">
              <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute -bottom-2 -right-2 bg-gold text-cream text-[9px] px-1 py-0.5 rounded shadow z-10">
                  Главная
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-[11px] font-sans text-chocolate/50 leading-normal">
        * Выделите несколько файлов при выборе. Первая фотография станет главной обложкой.
      </p>
    </div>
  );
}