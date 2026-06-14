'use client';

import { useState, useRef } from 'react';

// Максимальный размер одного фото в мегабайтах (лимит Cloudflare Workers)
const MAX_FILE_SIZE_MB = 3;

export function ImageUploadInput() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncFiles = (newFiles: File[]) => {
    // ⚡️ Фильтруем слишком тяжелые файлы, чтобы не положить сервер Cloudflare
    const validFiles = newFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`❌ Файл "${file.name}" слишком тяжелый! Максимум ${MAX_FILE_SIZE_MB} МБ. Сожмите фото перед загрузкой.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 10) {
      alert('Можно загрузить максимум 10 фотографий!');
      validFiles.splice(10); // Обрезаем лишнее
    }
    
    setFiles(validFiles);

    // Обновляем превью
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Подменяем файлы в скрытом инпуте для сервера
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      validFiles.forEach(f => dataTransfer.items.add(f));
      inputRef.current.files = dataTransfer.files;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    syncFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    syncFiles(newFiles);
  };

  return (
    <div className="mb-8 p-6 border border-dashed border-chocolate/30 bg-chocolate/5 hover:bg-chocolate/10 transition-colors">
      <label className="block text-xs font-sans uppercase tracking-widest text-chocolate/70 mb-2">
        Фотографии товара (до 10 шт. | макс {MAX_FILE_SIZE_MB} МБ на фото)
      </label>
      
      <input
        type="file"
        name="images"
        multiple
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        ref={inputRef}
        className="w-full text-sm text-chocolate/70 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-chocolate file:text-cream hover:file:bg-chocolate/90 cursor-pointer mb-4"
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {previews.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24 border border-chocolate/20 group shadow-sm">
              <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover bg-white" />
              
              {idx === 0 && (
                <span className="absolute bottom-0 left-0 w-full text-center bg-gold/90 backdrop-blur-sm text-cream text-[10px] py-1 z-10 font-medium tracking-widest uppercase">
                  Главная
                </span>
              )}
              
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20 hover:bg-red-600"
                title="Удалить фото"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-[11px] font-sans text-chocolate/50 leading-normal">
        * Пожалуйста, сжимайте фотографии перед загрузкой (оптимальный вес фото для сайта — до 500 КБ).
      </p>
    </div>
  );
}