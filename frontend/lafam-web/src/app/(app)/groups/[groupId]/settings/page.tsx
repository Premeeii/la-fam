import SettingsContent from '@/components/main-app/SettingContent';

export default function SettingsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return <SettingsContent params={params} />;
}
