import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { Product, PaginationMeta } from '@/types';
import ShopClient from '../../shop/ShopClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.ojam.in/api';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

const CATEGORY_META: Record<string, { name: string; description: string }> = {
  'whey-protein':   { name: 'Whey Protein',   description: 'Shop premium whey protein supplements at OJAM — lab-tested, FSSAI certified, India-made. 25g protein per serving.' },
  'plant-protein':  { name: 'Plant Protein',   description: 'Shop vegan plant protein supplements at OJAM — pea & rice blend, complete amino acid profile, 100% dairy free.' },
  'mass-gainer':    { name: 'Mass Gainer',     description: 'Shop mass gainer supplements at OJAM — high-calorie protein powder for bulking and serious size gains.' },
  'creatine':       { name: 'Creatine',        description: 'Shop pure creatine monohydrate at OJAM — micronized, unflavoured, third-party tested for maximum strength.' },
  'pre-workout':    { name: 'Pre-Workout',     description: 'Shop pre-workout supplements at OJAM — energy, focus, and pump for every training session.' },
  'vitamins':       { name: 'Vitamins',        description: 'Shop vitamins and wellness supplements at OJAM — daily essentials for performance and recovery.' },
};

async function fetchCategoryProducts(slug: string): Promise<{ products: Product[]; pagination: PaginationMeta } | null> {
  try {
    const res = await fetch(
      `${apiBase}/products?category=${slug}&sort=-createdAt&page=1&limit=12`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  if (!meta) return { title: 'Category Not Found' };

  const canonical = `${siteUrl}/category/${slug}`;
  return {
    title: `${meta.name} Supplements`,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: `${meta.name} Supplements | OJAM`,
      description: meta.description,
      url: canonical,
      images: [{ url: '/ojam.png', width: 1024, height: 1024, alt: `OJAM ${meta.name}` }],
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  if (!CATEGORY_META[slug]) redirect('/shop');

  const data = await fetchCategoryProducts(slug);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${siteUrl}/shop` },
      { '@type': 'ListItem', position: 3, name: CATEGORY_META[slug].name, item: `${siteUrl}/category/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ShopClient
        initialProducts={data?.products ?? []}
        initialPagination={data?.pagination ?? { page: 1, limit: 12, total: 0, pages: 0 }}
        category={slug}
      />
    </>
  );
}
