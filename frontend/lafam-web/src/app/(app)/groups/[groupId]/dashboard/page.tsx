'use client';

import { use } from 'react';
import { useGroup } from '@/lib/hooks/useGroup';
import { InviteMemberPopover } from '@/components/groups/InviteMemberPopover';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';
import { BillsContainer } from '@/components/dashboard/BillsContainer';

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
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Welcome Home, {isLoading ? '...' : currentGroup?.groupName || 'Unknown Group'}
          </h1>
          <span className="text-sm font-normal text-gray-500">
            What's happening today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.
          </span>
        </div>
        <div className="pt-1">
          <InviteMemberPopover groupId={resolvedParams.groupId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        <div className="lg:col-span-2 flex flex-col">
          <UpcomingEvents groupId={resolvedParams.groupId} />
        </div>
        
        <div className="flex flex-col">
          {/* Placeholder for Column 2: Bills, Group Member */}
          <BillsContainer groupId={resolvedParams.groupId} />
        </div>
      </div>
    </div>
  );
}
