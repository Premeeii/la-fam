'use client';
import { useEffect, use } from 'react';
import { useCurrentGroup } from '@/lib/stores/currentGroup';

//move from [groupId] layout for use layout to be server component
export default function GroupIdProvider({ 
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = use(params);
  const setGroupId = useCurrentGroup((s) => s.setGroupId);

  useEffect(() => {
    setGroupId(resolvedParams.groupId);
  }, [resolvedParams.groupId, setGroupId]);

  return <>{children}</>;
}
