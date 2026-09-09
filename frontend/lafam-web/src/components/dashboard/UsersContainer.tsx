'use client';

import { useGroupMembers } from '@/lib/hooks/useGroup';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

interface UsersContainerProps {
  groupId: string;
}

export function UsersContainer({ groupId }: UsersContainerProps) {
  const { data: members, isLoading } = useGroupMembers(groupId);

  const latestMembers = useMemo(() => {
    return members
      ?.sort((a, b) => {
        const dateA = new Date(a.joinedAt || 0);
        const dateB = new Date(b.joinedAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 4);
  }, [members]);

  if (isLoading) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-700"></div>
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-700"></div>
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="dark:bg-background mt-6 flex w-full flex-col rounded-[20px] border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700">
      <h2 className="mb-5 text-xl font-semibold text-gray-800 dark:text-gray-200">
        Members
      </h2>
      <div className="flex flex-col gap-4">
        {latestMembers?.map((member) => (
          <div key={member.userId} className="flex items-center gap-4 p-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.userAvatarUrl || ''} />
              <AvatarFallback className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {member.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {member.displayName}
                {member.role === 'OWNER'}
              </h3>
              {member.role === 'OWNER' && (
                <div className="text-sm text-gray-500 dark:text-gray-400">Owner</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Link href={`/groups/${groupId}/users`} className="w-full">
          <Button
            variant="outline"
            className="h-10 w-full rounded-lg border-gray-200 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            View All Members
          </Button>
        </Link>
      </div>
    </div>
  );
}
