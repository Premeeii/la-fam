import { Providers } from './providers';
import './globals.css';
import { Inter } from 'next/font/google';
import { Alef } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const alef = Alef({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '700'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lafamhub.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LaFam: Appointment Management & Expense Bill Platform',
    template: '%s | LaFam',
  },
  description:
    'La Fam is a platform for managing appointment and expense bills in groups, and sharing family or your friend group moments together.',
  applicationName: 'LaFam',
  alternates: {
    canonical: '/', //main page use for search engine
  },

  authors: [{ name: 'Preme' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'La Fam',
    title: 'LaFam — Connect with Your Group',
    description:
      'Plan group events, manage shared expenses, and keep your family and friends in sync with La Fam',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'La Fam',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaFam — Manage Your Group',
    description:
      'Discover La Fam, a platform for managing appointment and expense bills in groups, and sharing family or your friend group moments together.',
    images: ['/og-image.png'],
    creator: '@Premeeii',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={cn('font-sans', inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
