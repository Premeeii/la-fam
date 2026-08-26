'use client';
import Link from 'next/link';
import { Search, Settings, Star, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/lib/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { CreateGroupDialog } from './CreateGroupDialog';
import { Plus } from 'lucide-react';

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
        <Avatar className="h-9 w-9 border border-blue-100">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName ?? 'User'} />}
            <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
              {getInitials(displayName)}
            </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate font-normal text-gray-500">
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
          className="h-11 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { data: user } = useCurrentUser();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white lg:bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 lg:px-12">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/groups" className="text-xl font-bold tracking-tight text-gray-900">
            La'FAM
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search ..."
              className="h-10 w-full rounded-lg border-gray-200 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus-visible:ring-blue-100 shadow-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <CreateGroupDialog/>   
          <UserMenu displayName={user?.displayName ?? 'My Account'} avatarUrl={user?.avatarUrl} />
        </div>
      </div>
    </header>
  );
}
