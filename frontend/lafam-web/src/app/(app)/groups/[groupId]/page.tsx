import { redirect } from 'next/navigation';

export default async function GroupRootPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const resolvedParams = await params;
  redirect(`/groups/${resolvedParams.groupId}/dashboard`);
}
