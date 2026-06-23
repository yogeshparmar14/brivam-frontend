import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/cart', '/checkout', '/order-success', '/account/', '/login', '/register', '/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
