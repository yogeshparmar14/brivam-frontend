import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import type { Product, PaginationMeta } from '@/types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.ojam.in/api';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

async function fetchInitialProducts(params: Record<string, string | undefined>) {
  const { search, featured } = params;
  const query = new URLSearchParams({
    ...(search && { search }),
    ...(featured && { featured: 'true' }),
    sort: '-createdAt',
    page: '1',
    limit: '12',
  });

  try {
    const res = await fetch(`${apiBase}/products?${query}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json() as Promise<{ products: Product[]; pagination: PaginationMeta }>;
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const isPaged = page > 1;

  if (params.search) {
    return {
      title: `Search: "${params.search}"`,
      description: `Search results for "${params.search}" on OJAM supplements store.`,
      robots: { index: false, follow: true },
    };
  }

  if (params.featured) {
    return {
      title: isPaged ? `Best Sellers – Page ${page}` : 'Best Sellers',
      description: 'Our most popular protein supplements, top-rated by 50,000+ athletes across India.',
      alternates: { canonical: `${siteUrl}/shop?featured=true` },
      ...(isPaged && { robots: { index: false, follow: true } }),
    };
  }

  return {
    title: isPaged ? `Shop All Supplements – Page ${page}` : 'Shop All Supplements',
    description: "Browse OJAM's full range — whey protein, plant protein, creatine, mass gainers & more. Lab-tested, India-made supplements.",
    alternates: { canonical: `${siteUrl}/shop` },
    ...(isPaged && { robots: { index: false, follow: true } }),
    ...(!isPaged && {
      openGraph: {
        title: 'Shop All Supplements | OJAM',
        description: "Browse OJAM's full range — whey protein, plant protein, creatine, mass gainers & more.",
        url: `${siteUrl}/shop`,
        images: [{ url: '/ojam.png', width: 1024, height: 1024, alt: 'OJAM Supplements' }],
      },
    }),
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Redirect legacy category query params to clean URLs
  if (params.category) redirect(`/category/${params.category}`);

  const data = await fetchInitialProducts(params);

  return (
    <ShopClient
      initialProducts={data?.products ?? []}
      initialPagination={data?.pagination ?? { page: 1, limit: 12, total: 0, pages: 0 }}
      search={params.search}
      featured={params.featured}
    />
  );
}
