'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  displayName?: string;
  userAvatarUrl?: string;
  bio?: string;
  role?: string;
  className?: string;
}

function getInitials(name?: string) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ProfileCard({
  displayName,
  userAvatarUrl,
  bio,
  role,
  className,
}: ProfileCardProps) {
  return (
    <div
      className={cn(
        'flex w-[380px] sm:w-[420px] items-center gap-5 rounded-2xl  border-gray-200/80 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900',
        className
      )}
    >
      <Avatar className="h-24 w-24 shrink-0 border border-gray-100 shadow-sm dark:border-gray-800">
        {userAvatarUrl && (
          <AvatarImage
            src={userAvatarUrl}
            alt={displayName || 'User'}
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-blue-50 text-2xl font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col min-w-0 flex-1">
        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-gray-100 truncate">
          {displayName || 'User'}
        </h3>
        
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-gray-400 dark:text-gray-400 break-words line-clamp-3">
          {bio || role || 'No bio provided'}
        </p>
      </div>
    </div>
  );
}
