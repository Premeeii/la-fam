import { Providers } from './providers';
import './globals.css';
import { Inter } from 'next/font/google';
import { Alef } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const alef = Alef({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata = {
  title: "La'Fam",
  icons: {
    icon: '/icon.svg',
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
      </body>
    </html>
  );
}
