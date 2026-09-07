'use client';
import Link from 'next/link';

import { Search, Settings, User, LogOut, Menu } from 'lucide-react';
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
  avatarUrl,
}: {
  displayName?: string;
  avatarUrl?: string | null;
}) {
  const logoutMutation = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        <Avatar className="h-9 w-9 border border-blue-100 dark:border-blue-900">
          {avatarUrl && (
            <AvatarImage src={avatarUrl} alt={displayName ?? 'User'} />
          )}
          <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal text-gray-500 dark:text-gray-400">
            {displayName ?? 'My Account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="h-11 cursor-pointer">
            <Link href="/profile" className="flex w-full items-center">
              <User className="mr-2 h-4 w-4" /> Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logoutMutation.mutate()}
          className="h-11 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/30"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-700 dark:bg-background shadow-sm lg:dark:bg-background lg:dark:border-gray-700">
      <div className="flex h-13 items-center justify-between px-4 md:px-6 lg:px-12">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/groups"
            className="text-xl font-bold tracking-tight text-foreground "
          >
            La'FAM
          </Link>
        </div>

        {/* Center: Search */}
        <SearchGroupBar/>
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle/>
          <Link href="/settings" className="text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
            <Settings className="h-5 w-5" />
          </Link>
          {isGroupSpecific && !isJoinPage && (
            <GroupNav/>
          )}
          <CreateGroupDialog />
          <UserMenu
            displayName={user?.displayName ?? 'My Account'}
            avatarUrl={user?.avatarUrl}
          />
        </div>
      </div>
    </header>
  );
}
