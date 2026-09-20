'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function SettingsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <div className="flex absolute items-center  p-4 lg:hidden dark:border-gray-800">
        <Sheet open={open} onOpenChange={setOpen}>  
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 lg:hidden dark:text-gray-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Settings Menu</span>
              </Button>
            }
          ></SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Settings Navigation</SheetTitle>
            <div className="px-4 py-6">
              <h2 className="mb-6 px-3 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Settings
              </h2>
              <nav className="flex flex-col gap-2">
                <NavLinks />
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 px-6 py-6 lg:block dark:border-gray-800">
        <nav className="flex flex-col gap-2">
          <NavLinks />
        </nav>
      </aside>
    </>
  );
}
