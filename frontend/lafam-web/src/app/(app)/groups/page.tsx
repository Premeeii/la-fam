'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useGroup } from '@/lib/hooks/useGroup';

export default function GroupPage() {
  const { data: groups, isLoading } = useGroup();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Your Groups
      </h1>

      {isLoading ? (
        <div className="text-gray-500">Loading groups...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {groups?.map((group) => (
            <Card
              key={group.groupId}
              className="flex flex-col overflow-hidden rounded-xl border-gray-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-1 items-center gap-4 p-6">
                <Avatar className="h-14 w-14 border border-gray-100 shadow-sm">
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
                <div className="flex flex-col">
                  <h3 className="line-clamp-1 text-lg font-medium text-gray-900">
                    {group.groupName || 'Unnamed Group'}
                  </h3>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-gray-50 bg-white px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  {/* <Users className="h-4 w-4" />
                  <span>Members</span> */}
                </div>
                <Link
                  href={`/groups/${group.groupId}`}
                  className="text-sm font-medium text-gray-400 transition-colors hover:text-blue-600"
                >
                  Detail &rarr;
                </Link>
              </div>
            </Card>
          ))}

        </div>
      )}
    </div>
  );
}
