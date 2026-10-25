import DashboardContent from '@/components/main-app/DashboardContent';

export default function DashboardPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <DashboardContent params={params} />
  );
}
