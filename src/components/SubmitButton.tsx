'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';

interface SubmitButtonProps {
  defaultText?: string;
  loadingText?: string;
  successText?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SubmitButton({
  defaultText = 'Сохранить',
  loadingText = 'Сохранение...',
  successText = '✅ Успешно',
  className = '',
  children,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!pending && success) {
      timeout = setTimeout(() => { setSuccess(false); }, 3000);
    }
    if (pending) { setSuccess(true); }
    return () => clearTimeout(timeout);
  }, [pending, success]);

  return (
    <button
      type="submit"
      disabled={pending}
      // ⚡️ Убрали агрессивную смену цветов на желтый, теперь всё по дизайну
      className={`${className} transition-all duration-300 disabled:opacity-70 flex items-center justify-center`}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
          {loadingText}
        </span>
      ) : success && !pending ? (
        successText
      ) : (
        children || defaultText
      )}
    </button>
  );
}