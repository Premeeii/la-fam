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
    <Card className="dark:bg-background relative flex h-32 sm:h-55 flex-col overflow-hidden rounded-xl border-gray-100 border-2 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700">
      <div className="flex flex-1 items-center gap-2.5 sm:gap-4 p-3 sm:p-6 min-h-0">
        <Avatar className="h-10 w-10 sm:h-20 sm:w-20 shrink-0 border border-gray-100 shadow-sm dark:border-gray-700">
          {group.groupAvatarUrl && (
            <AvatarImage
              src={group.groupAvatarUrl}
              alt={group.groupName || 'Group'}
            />
          )}
          <AvatarFallback className="bg-blue-50 text-sm sm:text-lg font-medium text-blue-600">
            {(group.groupName || 'G').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col min-w-0">
          <h3 className="line-clamp-1 text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">
            {group.groupName || 'Unnamed Group'}
          </h3>
        </div>
      </div>

      <div className="dark:bg-background mt-auto flex items-center justify-between border-t border-gray-50 bg-white px-3 py-2 sm:px-6 sm:py-4 dark:border-gray-700">
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={bookmarkMutation.isPending}
          className="flex cursor-pointer items-center gap-1.5 text-xs sm:text-sm mt-4 text-gray-400 transition-colors hover:text-amber-400"
          title={group.isBooked ? 'Unbookmark Group' : 'Bookmark Group'}
        >
          <Star
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
              group.isBooked
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-400 hover:text-amber-400'
            }`}
          />
        </button>
        <Link
          href={`/groups/${group.groupId}`}
          className="text-xs sm:text-sm font-medium text-gray-400 mt-4 transition-colors hover:text-blue-600 dark:text-gray-500 dark:hover:text-white"
        >
          Detail &rarr;
        </Link>
      </div>
    </Card>
  );
}

export default function GroupPage() {
  const { data: groups, isLoading } = useGroup();

  const bookmarkedGroups = useMemo(() => {
    if (!groups) return [];
    return groups.filter((g) => g.isBooked);
  }, [groups]);

  return (
    <div className="flex flex-col gap-8">
      {isLoading ? (
        <div className="text-gray-500 dark:text-gray-400">
          Loading groups...
        </div>
      ) : (
        <>
          {/* bookmarked */}
          {bookmarkedGroups.length > 0 && (
            <div className="flex flex-col gap-6 ">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                BOOKMARKED GROUPS
              </h2>

              <div className="grid grid-cols-1  gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {bookmarkedGroups.map((group) => (
                  <GroupCardItem
                    key={`bookmark-${group.groupId}`}
                    group={group}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YOUR GROUPS SECTION (INCLUDES ALL GROUPS) */}
          <div className="flex flex-col gap-6 ">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                GROUPS
              </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {groups?.map((group) => (
                <GroupCardItem key={group.groupId} group={group} />
              ))}
              <CreateGroupCardDialog />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
