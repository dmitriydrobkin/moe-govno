'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

interface SubmitButtonProps {
  defaultText?: string;
  loadingText?: string;
  successText?: string;
  className?: string;
}

export function SubmitButton({
  defaultText = 'Сохранить',
  loadingText = 'Сохраняем...',
  successText = 'Сохранено!',
  // Базовые стили под твой дизайн (цвета из твоего layout.tsx)
  className = 'bg-chocolate text-cream px-6 py-3 text-sm uppercase tracking-wider font-sans transition-colors hover:bg-chocolate/90 disabled:opacity-50 disabled:cursor-not-allowed',
}: SubmitButtonProps) {
  // Хук Next.js, который магия обратного вызова привязывает к родительской <form>
  const { pending } = useFormStatus();
  
  const [showSuccess, setShowSuccess] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    // Если форма БЫЛА в процессе отправки, а теперь НЕТ — значит, всё сохранилось
    if (wasPending.current && !pending) {
      setShowSuccess(true);
      // Показываем галочку 3 секунды, затем возвращаем обычный текст
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          ⏳ {loadingText}
        </span>
      ) : showSuccess ? (
        <span className="flex items-center justify-center gap-2 text-gold">
          ✅ {successText}
        </span>
      ) : (
        <span>{defaultText}</span>
      )}
    </button>
  );
}
