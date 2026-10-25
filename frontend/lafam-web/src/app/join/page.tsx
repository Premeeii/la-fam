import JoinContent from '@/components/join/JoinContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join Group',
  description: 'Join a LaFam group using an invitation link to start collaborating with your family and friends.',
  alternates: {
    canonical: '/join',
  },
};

export default function JoinPage() {
  return (
    <JoinContent/>
  );
}
