// app/(app)/groups/[groupId]/layout.tsx
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import GroupIdProvider from '@/components/layout/GroupIdProvider';

async function getGroupName(groupId: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    if (!accessToken) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/groups`,
      {
        headers: {
          Cookie: `access_token=${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    if (!res.ok) return null;

    const groups = await res.json();
    const group = groups.find(
      (g: { groupId?: string }) => g.groupId === groupId,
    );
    return group?.groupName ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>;
}): Promise<Metadata> {
  const { groupId } = await params;
  const groupName = await getGroupName(groupId);

  return {
    title: groupName || 'Group',
    description: groupName
      ? `Manage appointments, bills, and events for ${groupName} on LaFam.`
      : 'Manage your group on LaFam.',
  };
}

export default function GroupLayoutId({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  return (
    <GroupIdProvider params={params}>
      {children}
    </GroupIdProvider>
  );
}