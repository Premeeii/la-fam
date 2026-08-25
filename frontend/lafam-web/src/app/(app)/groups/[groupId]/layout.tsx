// app/(app)/groups/[groupId]/layout.tsx
'use client';
import { useEffect, use } from 'react';
import { useCurrentGroup } from '@/lib/stores/currentGroup';

export default function GroupLayoutId({
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