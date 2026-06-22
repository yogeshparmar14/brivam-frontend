import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyOjam from '@/components/home/WhyOjam';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

export const metadata: Metadata = {
  title: 'OJAM | Premium Protein Supplements India',
  description: 'Shop premium whey protein, plant protein, mass gainers, creatine & more. Clean ingredients, real results. Free shipping above ₹999.',
  alternates: { canonical: siteUrl },
  openGraph: {
    url: siteUrl,
    images: [{ url: '/ojam.png', width: 1024, height: 1024, alt: 'OJAM – Premium Protein Supplements' }],
  },
  twitter: {
    images: ['/ojam.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OJAM',
  url: siteUrl,
  logo: `${siteUrl}/ojam.png`,
  description: 'Premium protein supplements and nutrition products made in India.',
  email: 'hello@ojam.in',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@ojam.in',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/ojam_in',
    'https://www.facebook.com/ojamin',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OJAM',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/shop?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyOjam />
      <TestimonialsSection />
      <BenefitsSection />
    </>
  );
}
