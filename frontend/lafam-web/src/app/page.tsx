import type { Metadata } from 'next';
import IntroductionContent from '@/components/introduction/IntroductionContent';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lafamhub.com';

export const metadata: Metadata = {
  title: 'LaFam | Enhance your group',
  description:
    'LaFam is a collaborative web platform designed for managing group appointments, tracking shared expense bills, and keeping family and friends in sync.',
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LaFam',
  url: siteUrl,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  description:
    'LaFam is a collaborative web platform designed for organizing group appointments, tracking shared expenses and bills, and keeping family and friends in sync.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Group Appointment Management',
    'Shared Expense and Bill Splitting',
    'Interactive Group Calendar',
    'Family and Friend Collaboration',
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <IntroductionContent />
    </>
  );
}
