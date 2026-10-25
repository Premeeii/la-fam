import GroupContent from '@/components/main-app/GroupContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groups',
  description: 'View and manage all your LaFam groups. Create new groups or browse your bookmarked groups.',
  alternates: {
    canonical: '/groups',
  },
};

export default function GroupPage() {
  return (
    <GroupContent/>
  );
}
