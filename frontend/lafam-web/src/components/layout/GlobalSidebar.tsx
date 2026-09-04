'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function GlobalSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Groups',
      href: '/groups',
      icon: LayoutGrid,
    },
    {
      name: 'Setting',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-48 shrink-0 border-r border-gray-100 bg-white min-h-[calc(100vh-4rem)] p-4 flex-col gap-2 hidden lg:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/settings'); // mock setting
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
              {item.name}
            </div>
            <ChevronRight className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-300")} />
          </Link>
        );
      })}
    </aside>
  );
}
