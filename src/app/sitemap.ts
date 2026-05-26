import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aura.systems';

const locales   = ['en', 'tr'] as const;
const routes = [
  { path: '',              changeFrequency: 'weekly'  as const, priority: 1.0  },
  { path: '/about',        changeFrequency: 'monthly' as const, priority: 0.85 },
  { path: '/projects',     changeFrequency: 'weekly'  as const, priority: 0.80 },
  { path: '/procedures',   changeFrequency: 'monthly' as const, priority: 0.80 },
  { path: '/contact',      changeFrequency: 'monthly' as const, priority: 0.75 },
  { path: '/engage',       changeFrequency: 'monthly' as const, priority: 0.70 },
  { path: '/kvkk',         changeFrequency: 'yearly'  as const, priority: 0.30 },
  { path: '/privacy',      changeFrequency: 'yearly'  as const, priority: 0.30 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { path, changeFrequency, priority } of routes) {
      entries.push({
        url:              `${SITE_URL}/${locale}${path}`,
        lastModified:     now,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
