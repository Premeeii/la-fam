'use client';

import { use } from 'react';
import { useGroup } from '@/lib/hooks/useGroup';

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
    <div>
      <h1 className="text-2xl font-bold">
        Welcome,{' '}
        {isLoading ? 'Loading...' : currentGroup?.groupName || 'Unknown Group'}
      </h1>
      <span className="text-md font-light text-gray-400">
        Here's what's happening today, {new Date().toDateString()}.
      </span>
    </div>
  );
}
