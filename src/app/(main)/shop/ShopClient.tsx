'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { Product, PaginationMeta } from '@/types';
import { SlidersHorizontal, X } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'variants.0.price' },
  { label: 'Price: High to Low', value: '-variants.0.price' },
  { label: 'Best Rated', value: '-averageRating' },
  { label: 'Most Popular', value: '-reviewCount' },
];

interface ShopClientProps {
  initialProducts: Product[];
  initialPagination: PaginationMeta;
  category?: string;
  search?: string;
  featured?: string;
}

export default function ShopClient({
  initialProducts,
  initialPagination,
  category,
  search,
  featured,
}: ShopClientProps) {
  const [sort, setSort] = useState('-createdAt');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // True only when query params match what the server already fetched
  const isInitialQuery = sort === '-createdAt' && !minPrice && !maxPrice && page === 1;

  const { data, isLoading } = useQuery<{ products: Product[]; pagination: PaginationMeta }>({
    queryKey: ['products', category, search, featured, sort, minPrice, maxPrice, page],
    queryFn: async () => {
      const query = new URLSearchParams({
        ...(category && { category }),
        ...(search && { search }),
        ...(featured && { featured: 'true' }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        sort,
        page: String(page),
        limit: '12',
      });
      const { data } = await api.get(`/products?${query}`);
      return data;
    },
    initialData: isInitialQuery
      ? { products: initialProducts, pagination: initialPagination }
      : undefined,
    staleTime: 60_000,
  });

  const title = search
    ? `Search: "${search}"`
    : category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    : featured
    ? 'Best Sellers'
    : 'All Products';

  return (
    <div className="container-site py-10">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
          {data && <p className="text-gray-500 text-sm mt-1">{data.pagination.total} products</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded text-sm text-gray-600 hover:border-brand-600 hover:text-brand-700"
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-200 px-3 py-2 rounded text-sm text-gray-600 focus:outline-none focus:border-brand-600"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center p-4 bg-gray-50 rounded-lg mb-6 border border-gray-100">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Price:</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => { setMinPrice(e.target.value); setPage(1); }}
              className="w-24 border border-gray-200 px-2 py-1.5 rounded text-sm focus:outline-none focus:border-brand-600"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
              className="w-24 border border-gray-200 px-2 py-1.5 rounded text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
          {(minPrice || maxPrice) && (
            <button
              onClick={() => { setMinPrice(''); setMaxPrice(''); }}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : data?.products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium mb-2">No products found</p>
          <p className="text-sm">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>

          {data && data.pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${
                    p === page ? 'bg-brand-700 text-white' : 'border border-gray-200 text-gray-600 hover:border-brand-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
