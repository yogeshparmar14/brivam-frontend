'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { Category } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Variant {
  flavor: string;
  weight: string;
  sku: string;
  price: string;
  mrp: string;
  stock: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    category: '',
    tags: '',
    howToUse: '',
    ingredients: '',
    benefits: '',
    isFeatured: false,
  });
  const [variants, setVariants] = useState<Variant[]>([
    { flavor: '', weight: '', sku: '', price: '', mrp: '', stock: '' },
  ]);
  const [nutritionRows, setNutritionRows] = useState([{ label: '', perServing: '', per100g: '' }]);

  const { data: categoriesData } = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data;
    },
  });

  const updateVariant = (i: number, k: keyof Variant, v: string) => {
    setVariants(prev => prev.map((vr, idx) => idx === i ? { ...vr, [k]: v } : vr));
  };

  const addVariant = () => setVariants(prev => [...prev, { flavor: '', weight: '', sku: '', price: '', mrp: '', stock: '' }]);
  const removeVariant = (i: number) => setVariants(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    if (variants.some(v => !v.sku || !v.price || !v.mrp || !v.stock)) {
      toast.error('Please fill all required variant fields (SKU, price, MRP, stock)'); return;
    }
    setLoading(true);
    try {
      await api.post('/products', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        benefits: form.benefits.split('\n').map(b => b.trim()).filter(Boolean),
        variants: variants.map(v => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
          stock: Number(v.stock),
          images: [],
        })),
        nutritionFacts: nutritionRows.filter(r => r.label),
        images: [],
      });
      toast.success('Product created!');
      router.push('/admin/products');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Basic Information</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            placeholder="e.g. OJAM Whey Protein Isolate"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
          <select
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
          >
            <option value="">Select category…</option>
            {categoriesData?.categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description *</label>
          <input
            value={form.shortDescription}
            onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600"
            placeholder="One-line product summary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            required
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 resize-none"
            placeholder="Full product description (HTML supported)"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
            <input
              value={form.tags}
              onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600"
              placeholder="whey, protein, muscle"
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))}
                className="accent-brand-700 w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Featured / Best Seller</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits (one per line)</label>
          <textarea
            value={form.benefits}
            onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand-600 resize-none"
            placeholder="25g protein per serving&#10;Low in fat and carbs&#10;Digestive enzymes added"
          />
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Variants (Flavors / Sizes)</h2>
          <button type="button" onClick={addVariant} className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline">
            <Plus size={15} /> Add Variant
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg relative">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Flavor</label>
              <input
                value={v.flavor}
                onChange={e => updateVariant(i, 'flavor', e.target.value)}
                placeholder="e.g. Chocolate"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weight/Size</label>
              <input
                value={v.weight}
                onChange={e => updateVariant(i, 'weight', e.target.value)}
                placeholder="e.g. 1kg"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
              <input
                value={v.sku}
                onChange={e => updateVariant(i, 'sku', e.target.value)}
                required
                placeholder="BRIV-WHY-CHO-1KG"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹) *</label>
              <input
                type="number"
                value={v.price}
                onChange={e => updateVariant(i, 'price', e.target.value)}
                required
                placeholder="1999"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">MRP (₹) *</label>
              <input
                type="number"
                value={v.mrp}
                onChange={e => updateVariant(i, 'mrp', e.target.value)}
                required
                placeholder="2499"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
              <input
                type="number"
                value={v.stock}
                onChange={e => updateVariant(i, 'stock', e.target.value)}
                required
                placeholder="50"
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600 bg-white"
              />
            </div>
            {variants.length > 1 && (
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Nutrition Facts</h2>
          <button
            type="button"
            onClick={() => setNutritionRows(p => [...p, { label: '', perServing: '', per100g: '' }])}
            className="flex items-center gap-1.5 text-sm text-brand-700 hover:underline"
          >
            <Plus size={15} /> Add Row
          </button>
        </div>
        {nutritionRows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <input
              value={row.label}
              onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, label: e.target.value } : r))}
              placeholder="e.g. Protein"
              className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600"
            />
            <input
              value={row.perServing}
              onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, perServing: e.target.value } : r))}
              placeholder="Per serving (e.g. 25g)"
              className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600"
            />
            <input
              value={row.per100g}
              onChange={e => setNutritionRows(p => p.map((r, idx) => idx === i ? { ...r, per100g: e.target.value } : r))}
              placeholder="Per 100g (e.g. 80g)"
              className="border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-brand-600"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
          {loading ? 'Creating…' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
