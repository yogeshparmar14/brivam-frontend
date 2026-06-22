import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyOjam from '@/components/home/WhyOjam';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OJAM | Premium Protein Supplements India',
  description: 'Shop premium whey protein, plant protein, mass gainers, creatine & more. Clean ingredients, real results. Free shipping above ₹999.',
  openGraph: {
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
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/ojam.png`,
  description: 'Premium protein supplements and nutrition products made in India.',
  sameAs: [
    'https://www.instagram.com/ojam_in',
    'https://www.facebook.com/ojamin',
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
