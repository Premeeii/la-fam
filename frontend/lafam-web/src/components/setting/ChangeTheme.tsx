'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes = [
  {
    value: 'light',
    label: 'Light',
    navbar: 'bg-white border-b border-gray-200',
    body: 'bg-white',
  },
  {
    value: 'dark',
    label: 'Dark',
    navbar: 'bg-[#1F2022] border-b border-gray-700',
    body: 'bg-[#1F2022]',
  },
  {
    value: 'system',
    label: 'System',
    navbar:
      'bg-linear-to-r from-white from-50% to-[#1F2022] to-50% border-b border-gray-700',
    body: 'bg-linear-to-r from-white from-50% to-[#1F2022] to-50%',
  },
] as const;

export function ChangeTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mt-4 flex gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 w-50 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {themes.map((t) => {
        const isActive = theme === t.value;
        return (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={cn(
              'group relative flex w-75 flex-col overflow-hidden rounded-lg border-2 transition-all hover:shadow-md',
              isActive
                ? 'border-blue-600 shadow-sm'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
            )}
          >
            {/* Mini preview */}
            <div className="flex flex-col">
              {/* Navbar preview */}
              <div className={cn('h-5 w-full', t.navbar)} />
              {/* Body preview */}
              <div className={cn('h-30 w-full', t.body)} />
            </div>

            {/* Label + check */}
            <div
              className={cn(
                'flex items-center justify-between px-3 py-2 text-xs font-medium',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              )}
            >
              {t.label}
              {isActive && <Check className="h-3.5 w-3.5" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}
