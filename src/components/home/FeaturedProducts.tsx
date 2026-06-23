'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const tabs = [
  { label: 'All', slug: null },
  { label: 'Whey Protein', slug: 'whey-protein' },
  { label: 'Plant Protein', slug: 'plant-protein' },
  { label: 'Creatine', slug: 'creatine' },
  { label: 'Mass Gainer', slug: 'mass-gainer' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.products;
    },
  });

  const filtered = activeTab
    ? data?.filter((p) => {
        const slug = typeof p.category === 'object' ? p.category.slug : '';
        return slug === activeTab;
      })
    : data;

  return (
    <section className="py-16 bg-white">
      <div className="container-site">

        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase text-brand-700 leading-none">
            Our Range<br className="hidden md:block" /> of Products
          </h2>
          <div className="hidden md:flex gap-2">
            <button className="w-9 h-9 border-2 border-gray-200 hover:border-brand-700 flex items-center justify-center transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button className="w-9 h-9 border-2 border-gray-200 hover:border-brand-700 bg-brand-700 text-white flex items-center justify-center transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-5 py-2 text-sm font-bold uppercase tracking-wide border-2 transition-all ${
                activeTab === tab.slug
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-700 hover:text-brand-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-semibold">No products in this category yet.</p>
          </div>
        )}

        {/* Shop All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="btn-primary px-12 py-3.5 text-sm tracking-widest"
          >
            SHOP ALL
          </Link>
        </div>

      </div>
    </section>
  );
}
