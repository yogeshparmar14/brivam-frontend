import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Protein Supplements',
  description: 'Browse whey protein, plant protein, mass gainers, creatine and more. Filter by category, price and rating. Free shipping above ₹999.',
  openGraph: {
    title: 'Shop Protein Supplements | BRIVAM',
    description: 'Browse whey protein, plant protein, mass gainers, creatine and more.',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
