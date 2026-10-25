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
    default: 'LaFam | Enhance your group',
    template: '%s | LaFam',
  },
  description:
    'La Fam is a platform for managing appointment and expense bills in groups, and sharing family or your friend group moments together.',
  applicationName: 'LaFam',

  authors: [{ name: 'Preme' }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'LaFam',
    title: 'LaFam — Connect with Your Group',
    description:
      'Plan group events, manage shared expenses, and keep your family and friends in sync with LaFam',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LaFam — i wish to help you to enhance your group',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaFam — Manage Your Group',
    description:
      'Discover LaFam, a platform for managing appointment and expense bills in groups, and sharing family or your friend group moments together.',
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

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'LaFam',
      description:
        'Platform for managing group appointments and shared expense bills.',
      inLanguage: 'en',
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'LaFam',
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      sameAs: ['https://github.com/Premeeii'],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn('font-sans', inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
