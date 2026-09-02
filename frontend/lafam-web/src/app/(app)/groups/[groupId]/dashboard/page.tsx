'use client';

import { use } from 'react';
import { useGroup } from '@/lib/hooks/useGroup';
import { InviteMemberPopover } from '@/components/groups/InviteMemberPopover';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { BillsContainer } from '@/components/dashboard/BillsContainer';
import { UsersContainer } from '@/components/dashboard/UsersContainer';
import { UpcomingWeek } from '@/components/dashboard/UpcomingWeek';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const { data: groups, isLoading } = useGroup();

  // Find the group that matches the current URL parameter
  const currentGroup = groups?.find(
    (g) => g.groupId === resolvedParams.groupId,
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 md:mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-2xl md:text-3xl font-semibold text-gray-900">
            Welcome to{' '}
            {isLoading ? '...' : currentGroup?.groupName || 'Unknown Group'}
          </h1>
          <span className="text-sm font-normal text-gray-500">
            What's will happening,{' '}
            {new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
            .
          </span>
        </div>
        <div className="pt-1">
          <InviteMemberPopover groupId={resolvedParams.groupId} />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 md:gap-8 lg:col-span-2">
          <UpcomingEvents groupId={resolvedParams.groupId} />
          <UpcomingWeek groupId={resolvedParams.groupId} />
        </div>

        <div className="flex flex-col">
          {/* Placeholder for Column 2: Bills, Group Member */}
          <BillsContainer groupId={resolvedParams.groupId} />
          <UsersContainer groupId={resolvedParams.groupId} />
        </div>
      </div>
    </div>
  );
}
