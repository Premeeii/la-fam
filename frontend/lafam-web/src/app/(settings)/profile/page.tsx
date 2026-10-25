import ProfileContent from '@/components/setting-content/ProfileContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and edit your LaFam profile information.',
  alternates: {
    canonical: '/profile',
  },
};

export default function ProfilePage() {
  return (
    <ProfileContent/>
  );
}
