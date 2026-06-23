import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductClient from './ProductClient';
import type { Product, Review } from '@/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.ojam.in/api';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${apiBase}/products/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ?? null;
  } catch {
    return null;
  }
}

async function fetchReviews(productId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${apiBase}/products/${productId}/reviews?limit=5`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reviews ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${apiBase}/products?limit=500`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.products ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  const image = product.images[0];

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `${siteUrl}/product/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `${siteUrl}/product/${slug}`,
      images: image ? [{ url: image, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const categoryName = typeof product.category === 'object' ? product.category.name : 'Products';
  const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

  const reviews = product.reviewCount > 0 ? await fetchReviews(product._id) : [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `${siteUrl}/shop?category=${categorySlug}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${siteUrl}/product/${product.slug}` },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.images,
    brand: { '@type': 'Brand', name: product.brand || 'OJAM' },
    ...(product.variants[0]?.sku && { sku: product.variants[0].sku }),
    offers: product.variants.map(v => ({
      '@type': 'Offer',
      price: v.price,
      priceCurrency: 'INR',
      availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'OJAM' },
    })),
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(reviews.length > 0 && {
      review: reviews.map(r => ({
        '@type': 'Review',
        name: r.title,
        reviewBody: r.comment,
        datePublished: r.createdAt,
        author: { '@type': 'Person', name: r.user.name },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      })),
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
