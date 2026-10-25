import ChangeEmailContent from '@/components/setting-content/ChangeEmailContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Email',
  description: 'Update the email address associated with your LaFam account.',
  alternates: {
    canonical: '/settings/change-email',
  },
};

export default function ChangeEmailPage() {
  return (
    <ChangeEmailContent/>
  );
}
