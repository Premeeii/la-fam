'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 px-4 lg:px-6 py-6 lg:border-r lg:border-gray-200 lg:dark:border-gray-800">
      <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
