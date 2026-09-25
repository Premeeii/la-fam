'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import {
  Settings,
  User,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

import { useLogout } from '@/lib/hooks/useLogout';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { CreateGroupPopover } from './CreateGroupPopover';
import { GroupNav } from './GroupNav';
import { SearchGroupBar } from './SearchGroupBar';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function UserMenu({
  displayName,
  email,
  avatarUrl,
}: {
  displayName?: string;
  email?: string;
  avatarUrl?: string | null;
}) {
  const logoutMutation = useLogout();
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9 border border-blue-100">
          {avatarUrl && (
            <AvatarImage src={avatarUrl} alt={displayName ?? 'User'} />
          )}
          <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2 font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0 border border-blue-100 dark:border-blue-900">
                {avatarUrl && (
                  <AvatarImage src={avatarUrl} alt={displayName ?? 'User'} />
                )}
                <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {displayName ?? 'My Account'}
                </span>
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {email ?? 'My email'}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="h-11 cursor-pointer"
            render={<Link href="/profile" />}
          >
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem
          className="h-11 cursor-pointer"
          render={<Link href="/settings" />}
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="h-11 cursor-pointer">
            <div className="flex w-full items-center">
              Theme
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="mr-6 flex w-36 flex-col gap-1 p-1">
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${theme === 'light' ? 'bg-gray-100 font-medium dark:bg-gray-800' : ''}`}
              >
                <Sun className="h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${theme === 'dark' ? 'bg-gray-100 font-medium dark:bg-gray-800' : ''}`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors ${theme === 'system' ? 'bg-gray-100 font-medium dark:bg-gray-800' : ''}`}
              >
                <Laptop className="h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          className="h-11 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/30"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { data: user } = useCurrentUser();
  const pathname = usePathname();

  const isGroupSpecific = pathname.match(/^\/groups\/([^\/]+)(\/|$)/);
  const isJoinPage = pathname === '/groups/join';

  return (
    <header className="dark:bg-background lg:dark:bg-background sticky top-0 z-50 w-full border-b border-gray-100 shadow-sm dark:border-gray-700 lg:dark:border-gray-700">
      <div className="flex h-13 items-center justify-between px-4 md:px-6 lg:px-12">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/groups"
            className="text-foreground flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <Image
              src="/icon.svg"
              alt="La'FAM"
              height={30}
              width={30}
              priority
              className="object-cover"
            />
            <span className="hidden sm:block">La'FAM</span>
          </Link>
        </div>

        {/* Center: Search */}
        <SearchGroupBar />
        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {isGroupSpecific && !isJoinPage && <GroupNav />}
          <CreateGroupPopover />
          <UserMenu
            displayName={user?.displayName ?? 'My Account'}
            email={user?.email ?? 'My email'}
            avatarUrl={user?.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
