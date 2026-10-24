import UsersContent from '@/components/main-app/UserContent';

export default function UsersPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return <UsersContent params={params} />;
}
