import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.lafamhub.com';
  if (!baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_BASE_URL environment variable');
  }
  return [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/login`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/register`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/forgot-password`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/reset-password`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/terms`, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
