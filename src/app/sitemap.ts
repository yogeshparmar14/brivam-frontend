import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/register`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  try {
    const res = await fetch(`${apiBase}/products?limit=500&fields=slug,updatedAt,createdAt`);
    if (res.ok) {
      const data = await res.json();
      const productPages: MetadataRoute.Sitemap = (data.products ?? []).map(
        (p: { slug: string; updatedAt?: string; createdAt: string }) => ({
          url: `${base}/product/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.createdAt),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }),
      );
      return [...staticPages, ...productPages];
    }
  } catch {
    // API unavailable at build time — return static pages only
  }

  return staticPages;
}
