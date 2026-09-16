'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Settings, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useLogout } from '@/lib/hooks/useLogout';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { CreateGroupDialog } from './CreateGroupDialog';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9 border border-blue-100 ">
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
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0 border border-blue-100 dark:border-blue-900">
                {avatarUrl && (
                  <AvatarImage src={avatarUrl} alt={displayName ?? 'User'} />
                )}
                <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col min-w-0">
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
          <DropdownMenuItem className="h-11 cursor-pointer">
            <Link href="/profile" className="flex w-full items-center">
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem className="h-11 cursor-pointer">
          <Link href="/settings" className="flex w-full items-center">
            Settings
          </Link>
        </DropdownMenuItem>
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
          <ThemeToggle />
          {isGroupSpecific && !isJoinPage && <GroupNav />}
          <CreateGroupDialog />
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
