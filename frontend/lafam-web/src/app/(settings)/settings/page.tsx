import SettingsContainer from '@/components/setting-content/SettingContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your LaFam account settings, preferences, and security options.',
  alternates: {
    canonical: '/settings',
  },
};

export default function SettingsPage() {
  return (
      <SettingsContainer />
  );
}
