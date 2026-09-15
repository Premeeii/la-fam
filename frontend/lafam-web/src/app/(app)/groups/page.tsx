'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useGroup, useGroupBookmark } from '@/lib/hooks/useGroup';
import { CreateGroupCardDialog } from '@/components/layout/CreateGroupCardDialog';
import type { components } from '@/types/api';

type GroupMemberResponse = components['schemas']['GroupMemberResponse'];

function GroupCardItem({ group }: { group: GroupMemberResponse }) {
  const bookmarkMutation = useGroupBookmark(group.groupId!);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    bookmarkMutation.mutate();
  };

  return (
    <Card className="dark:bg-background relative flex h-55 flex-col overflow-hidden rounded-xl border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700">
      <div className="flex flex-1 items-center gap-4 p-6">
        <Avatar className="h-20 w-20 border border-gray-100 shadow-sm dark:border-gray-700">
          {group.groupAvatarUrl && (
            <AvatarImage
              src={group.groupAvatarUrl}
              alt={group.groupName || 'Group'}
            />
          )}
          <AvatarFallback className="bg-blue-50 text-lg font-medium text-blue-600">
            {(group.groupName || 'G').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <h3 className="line-clamp-1 text-lg font-medium text-gray-900 dark:text-gray-100">
            {group.groupName || 'Unnamed Group'}
          </h3>
        </div>
      </div>

      <div className="dark:bg-background mt-auto flex items-center justify-between border-t border-gray-50 bg-white px-6 py-4 dark:border-gray-700">
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={bookmarkMutation.isPending}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-amber-400"
          title={group.isBooked ? 'Unbookmark Group' : 'Bookmark Group'}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              group.isBooked
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-400 hover:text-amber-400'
            }`}
          />
        </button>
        <Link
          href={`/groups/${group.groupId}`}
          className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 dark:text-gray-500 dark:hover:text-white"
        >
          Detail &rarr;
        </Link>
      </div>
    </Card>
  );
}

export default function GroupPage() {
  const { data: groups, isLoading } = useGroup();

  const sortedGroups = useMemo(() => {
    if (!groups) return [];
    return [...groups].sort((a, b) => {
      const aBooked = a.isBooked ? 1 : 0;
      const bBooked = b.isBooked ? 1 : 0;
      return bBooked - aBooked;
    });
  }, [groups]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        YOUR GROUPS
      </h1>
      <div className="w-full border-t border-gray-300 dark:border-gray-700" />

      {isLoading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading groups...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {sortedGroups.map((group) => (
            <GroupCardItem key={group.groupId} group={group} />
          ))}
          <CreateGroupCardDialog />
        </div>
      )}
    </div>
  );
}
