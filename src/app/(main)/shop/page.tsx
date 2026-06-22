import type { Metadata } from 'next';
import ShopClient from './ShopClient';
import type { Product, PaginationMeta } from '@/types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

async function fetchInitialProducts(params: Record<string, string | undefined>) {
  const { category, search, featured } = params;
  const query = new URLSearchParams({
    ...(category && { category }),
    ...(search && { search }),
    ...(featured && { featured: 'true' }),
    sort: '-createdAt',
    page: '1',
    limit: '12',
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?${query}`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    return res.json() as Promise<{ products: Product[]; pagination: PaginationMeta }>;
  } catch {
    return null;
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;

  if (params.search) {
    return {
      title: `Search: "${params.search}"`,
      description: `Search results for "${params.search}" on OJAM supplements store.`,
      robots: { index: false, follow: true },
    };
  }

  if (params.category) {
    const name = params.category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    return {
      title: `${name} Supplements`,
      description: `Shop ${name} at OJAM — premium quality, lab-tested, India-made protein supplements.`,
      alternates: { canonical: `${siteUrl}/shop?category=${params.category}` },
    };
  }

  if (params.featured) {
    return {
      title: 'Best Sellers',
      description: 'Our most popular protein supplements, top-rated by 50,000+ athletes across India.',
      alternates: { canonical: `${siteUrl}/shop?featured=true` },
    };
  }

  return {
    title: 'Shop All Supplements',
    description: "Browse OJAM's full range — whey protein, plant protein, creatine, mass gainers & more. Lab-tested, India-made supplements.",
    alternates: { canonical: `${siteUrl}/shop` },
    openGraph: {
      title: 'Shop All Supplements | OJAM',
      description: "Browse OJAM's full range — whey protein, plant protein, creatine, mass gainers & more.",
      url: `${siteUrl}/shop`,
      images: [{ url: '/ojam.png', width: 1024, height: 1024, alt: 'OJAM Supplements' }],
    },
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await fetchInitialProducts(params);

  return (
    <ShopClient
      initialProducts={data?.products ?? []}
      initialPagination={data?.pagination ?? { page: 1, limit: 12, total: 0, pages: 0 }}
      category={params.category}
      search={params.search}
      featured={params.featured}
    />
  );
}
