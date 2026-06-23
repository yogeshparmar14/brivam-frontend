'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Category } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/admin/ImageUploader';

interface Variant {
  _id?: string;
  flavor: string;
  weight: string;
  sku: string;
  price: string;
  mrp: string;
  stock: string;
  images?: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', shortDescription: '', description: '', category: '',
    tags: '', howToUse: '', ingredients: '', benefits: '', isFeatured: false, isActive: true,
  });
  const [variants, setVariants] = useState<Variant[]>([
    { flavor: '', weight: '', sku: '', price: '', mrp: '', stock: '' },
  ]);
  const [nutritionRows, setNutritionRows] = useState([{ label: '', perServing: '', per100g: '' }]);
  const [images, setImages] = useState<string[]>([]);

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/admin/${id}`);
      return data.product;
    },
  });

  const { data: categoriesData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => { const { data } = await api.get('/categories'); return data; },
  });

  useEffect(() => {
    if (!productData) return;
    setForm({
      name: productData.name || '',
      shortDescription: productData.shortDescription || '',
      description: productData.description || '',
      category: typeof productData.category === 'object' ? productData.category._id : productData.category || '',
      tags: (productData.tags || []).join(', '),
      howToUse: productData.howToUse || '',
      ingredients: productData.ingredients || '',
      benefits: (productData.benefits || []).join('\n'),
      isFeatured: productData.isFeatured || false,
      isActive: productData.isActive ?? true,
    });
    if (productData.variants?.length) {
      setVariants(productData.variants.map((v: Variant) => ({
        _id: v._id,
        flavor: v.flavor || '',
        weight: v.weight || '',
        sku: v.sku || '',
        price: String(v.price),
        mrp: String(v.mrp),
        stock: String(v.stock),
        images: v.images || [],
      })));
    }
    if (productData.nutritionFacts?.length) {
      setNutritionRows(productData.nutritionFacts);
    }
    if (productData.images?.length) {
      setImages(productData.images);
    }
  }, [productData]);

  const updateVariant = (i: number, k: keyof Variant, v: string) =>
    setVariants(prev => prev.map((vr, idx) => idx === i ? { ...vr, [k]: v } : vr));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    if (variants.some(v => !v.sku || !v.price || !v.mrp || !v.stock)) {
      toast.error('Please fill all required variant fields'); return;
    }
    setLoading(true);
    try {
      await api.put(`/products/${id}`, {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        benefits: form.benefits.split('\n').map(b => b.trim()).filter(Boolean),
        variants: variants.map(v => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
          stock: Number(v.stock),
        })),
        nutritionFacts: nutritionRows.filter(r => r.label),
        images,
      });
      toast.success('Product updated!');
      router.push('/admin/products');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) return <div className="text-center py-20 text-gray-400">Loading product…</div>;
  if (!productData) return <div className="text-center py-20 text-red-400">Product not found</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Basic Information</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 bg-white">
            <option value="">Select category…</option>
            {categoriesData?.categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description *</label>
          <input value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600" placeholder="whey, protein, muscle" />
          </div>
          <div className="flex items-end gap-4 pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="accent-brand-700 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-brand-700 w-4 h-4" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits (one per line)</label>
          <textarea value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 resize-none" />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Product Images</h2>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Variants</h2>
          <button type="button" onClick={() => setVariants(p => [...p, { flavor: '', weight: '', sku: '', price: '', mrp: '', stock: '' }])}
            className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
            <Plus size={15} /> Add Variant
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg relative">
            {[
              { k: 'flavor', label: 'Flavor', placeholder: 'Chocolate', type: 'text' },
              { k: 'weight', label: 'Weight/Size', placeholder: '1kg', type: 'text' },
              { k: 'sku', label: 'SKU *', placeholder: 'BRIV-WHY-1KG', type: 'text' },
              { k: 'price', label: 'Price (₹) *', placeholder: '1999', type: 'number' },
              { k: 'mrp', label: 'MRP (₹) *', placeholder: '2499', type: 'number' },
              { k: 'stock', label: 'Stock *', placeholder: '50', type: 'number' },
            ].map(({ k, label, placeholder, type }) => (
              <div key={k} className={k === 'flavor' ? 'col-span-2 md:col-span-1' : ''}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type={type} value={v[k as keyof Variant] as string} onChange={e => updateVariant(i, k as keyof Variant, e.target.value)}
                  placeholder={placeholder} className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white" />
              </div>
            ))}
            {variants.length > 1 && (
              <button type="button" onClick={() => setVariants(p => p.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Nutrition Facts</h2>
          <button type="button" onClick={() => setNutritionRows(p => [...p, { label: '', perServing: '', per100g: '' }])}
            className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
            <Plus size={15} /> Add Row
          </button>
        </div>
        {nutritionRows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <input value={row.label} onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, label: e.target.value } : r))}
              placeholder="e.g. Protein" className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600" />
            <input value={row.perServing} onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, perServing: e.target.value } : r))}
              placeholder="Per serving (25g)" className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600" />
            <input value={row.per100g} onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, per100g: e.target.value } : r))}
              placeholder="Per 100g (80g)" className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600" />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
