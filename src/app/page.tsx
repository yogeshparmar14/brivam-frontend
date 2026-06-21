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
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyBrivam />
      <TestimonialsSection />
      <BenefitsSection />
    </>
  );
}
