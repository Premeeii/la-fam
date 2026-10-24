import PrivacyContent from '@/components/privacy/PrivacyContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy ',
    description: 'Describe privacy policy of LaFam',
    alternates: {
        canonical: '/privacy-policy',
    },   
}

export default function PrivacyPolicyPage() {
  return (
   <PrivacyContent />
  );
}
