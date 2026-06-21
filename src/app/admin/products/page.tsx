'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ products: Product[]; total: number }>({
    queryKey: ['admin-products', search, page],
    queryFn: async () => {
      const q = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const { data } = await api.get(`/products/admin?${q}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      toast.success('Product removed');
      qc.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error('Failed to remove product'),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-brand-600"
          />
        </div>
        <Link href="/admin/products/new" className="btn-primary py-2 px-4 text-sm gap-2">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Product</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Price</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Stock</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.products.map(product => (
              <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                      {product.images[0] && (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-gray-800 line-clamp-1 max-w-xs">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                  {typeof product.category === 'object' ? product.category.name : '—'}
                </td>
                <td className="py-3 px-4 text-gray-700 font-medium hidden md:table-cell">
                  {product.variants[0] ? formatPrice(product.variants[0].price) : '—'}
                </td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className={`text-xs font-medium ${product.variants.some(v => v.stock > 0) ? 'text-green-600' : 'text-red-500'}`}>
                    {product.variants.reduce((s, v) => s + v.stock, 0)} units
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {product.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/admin/products/${product._id}`} className="p-1.5 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded">
                      <Edit size={15} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Remove this product?')) deleteMutation.mutate(product._id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data && data.total === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
