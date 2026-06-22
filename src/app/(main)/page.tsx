import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyBrivam from '@/components/home/WhyBrivam';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BRIVAM | Premium Protein Supplements India',
  description: 'Shop premium whey protein, plant protein, mass gainers, creatine & more. Clean ingredients, real results. Free shipping above ₹999.',
  openGraph: {
    images: [{ url: '/newLogo.png', width: 895, height: 359, alt: 'BRIVAM – Premium Protein Supplements' }],
  },
  twitter: {
    images: ['/newLogo.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BRIVAM',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newLogo.png`,
  description: 'Premium protein supplements and nutrition products made in India.',
  sameAs: [
    'https://www.instagram.com/brivam_in',
    'https://www.facebook.com/brivamin',
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
      <WhyBrivam />
      <TestimonialsSection />
      <BenefitsSection />
    </>
  );
}
