'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

const empty: { code: string; type: 'percentage' | 'fixed'; value: string; minOrderValue: string; maxDiscount: string; usageLimit: string; expiresAt: string } = { code: '', type: 'percentage', value: '', minOrderValue: '', maxDiscount: '', usageLimit: '', expiresAt: '' };

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);

  const { data, isLoading } = useQuery<{ coupons: Coupon[] }>({
    queryKey: ['admin-coupons'],
    queryFn: async () => { const { data } = await api.get('/coupons'); return data; },
  });

  const createMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => api.post('/coupons', body),
    onSuccess: () => {
      toast.success('Coupon created');
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
      setShowForm(false);
      setForm(empty);
    },
    onError: () => toast.error('Failed to create coupon'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      toast.success('Coupon deleted');
      qc.invalidateQueries({ queryKey: ['admin-coupons'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/coupons/${id}`, { isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) { toast.error('Code and value are required'); return; }
    createMutation.mutate({
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minOrderValue: Number(form.minOrderValue) || 0,
      ...(form.maxDiscount && { maxDiscount: Number(form.maxDiscount) }),
      ...(form.usageLimit && { usageLimit: Number(form.usageLimit) }),
      ...(form.expiresAt && { expiresAt: form.expiresAt }),
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2 px-4 text-sm gap-2">
          <Plus size={15} /> {showForm ? 'Cancel' : 'New Coupon'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Create Coupon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="BRIVAM10" required
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600 uppercase" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'percentage' | 'fixed' }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600 bg-white">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Value *</label>
              <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                placeholder={form.type === 'percentage' ? '10' : '100'} required
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (₹)</label>
              <input type="number" value={form.minOrderValue} onChange={e => setForm(p => ({ ...p, minOrderValue: e.target.value }))}
                placeholder="499"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Discount (₹)</label>
              <input type="number" value={form.maxDiscount} onChange={e => setForm(p => ({ ...p, maxDiscount: e.target.value }))}
                placeholder="200"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))}
                placeholder="100"
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
              <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-600" />
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="btn-primary py-2 px-5 text-sm disabled:opacity-60">
            {createMutation.isPending ? 'Creating…' : 'Create Coupon'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Code</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Type</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Value</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Min Order</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Used</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Expires</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="py-3 px-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.coupons.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No coupons yet. Create one above.</td></tr>
            ) : data?.coupons.map(coupon => (
              <tr key={coupon._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4 font-mono font-semibold text-brand-700">{coupon.code}</td>
                <td className="py-3 px-4 text-gray-500 capitalize hidden sm:table-cell">{coupon.type}</td>
                <td className="py-3 px-4 font-medium text-gray-700">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  {coupon.maxDiscount ? <span className="text-xs text-gray-400 ml-1">(max ₹{coupon.maxDiscount})</span> : null}
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">₹{coupon.minOrderValue}</td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                  {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                </td>
                <td className="py-3 px-4 text-xs text-gray-400 hidden sm:table-cell">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => toggleMutation.mutate({ id: coupon._id, isActive: !coupon.isActive })}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${coupon.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => { if (confirm('Delete this coupon?')) deleteMutation.mutate(coupon._id); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
