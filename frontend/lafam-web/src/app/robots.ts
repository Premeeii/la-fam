import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!siteUrl) {
    throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/groups',
        '/settings',
        '/profile',
        '/api',
        '/reset-password',
      ]
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
