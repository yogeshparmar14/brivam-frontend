import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.ojam.in/api';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/shop?featured=true`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/whey-protein`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/category/plant-protein`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/category/mass-gainer`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/category/creatine`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/category/pre-workout`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/category/vitamins`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  try {
    const res = await fetch(`${apiBase}/products?limit=500&fields=slug,updatedAt,createdAt`, {
      next: { revalidate: 3600 },
    });
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
