import TermsContent from '@/components/terms/TermsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service of LaFam',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <TermsContent />
  );
}
