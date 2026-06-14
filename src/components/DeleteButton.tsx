'use client';

import { useFormStatus } from 'react-dom';

export function DeleteButton() {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm('Точно удалить? Это действие необратимо.')) {
          e.preventDefault();
        }
      }}
      className="text-chocolate/30 hover:text-red-600 transition-colors font-bold disabled:opacity-50 px-2 py-1 text-lg leading-none"
      title="Удалить"
    >
      {pending ? '⏳' : '✕'}
    </button>
  );
}