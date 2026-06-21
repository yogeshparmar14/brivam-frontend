'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return data.products;
    },
  });

  return (
    <section className="py-16">
      <div className="container-site">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Best Sellers</h2>
            <p className="text-gray-500">Our most loved products, backed by real results</p>
          </div>
          <Link href="/shop" className="hidden md:flex items-center gap-1 text-brand-700 font-semibold text-sm hover:gap-2 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p>No products found. Add some products from the admin panel.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link href="/shop" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </section>
  );
}
