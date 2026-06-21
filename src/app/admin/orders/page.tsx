'use client';
import { use, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '@/types';
import { formatPrice, orderStatusColor } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_OPTIONS = ['all', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage({ searchParams }: PageProps) {
  const params = use(searchParams);
  const [status, setStatus] = useState(params.status || 'all');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ['admin-orders', status, page],
    queryFn: async () => {
      const q = new URLSearchParams({ page: String(page), limit: '20', ...(status !== 'all' && { status }) });
      const { data } = await api.get(`/orders?${q}`);
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      api.put(`/orders/${id}/status`, { orderStatus }),
    onSuccess: () => {
      toast.success('Order status updated');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return (
    <div className="space-y-5">
      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              status === s ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Order</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Customer</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Amount</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Date</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.orders.map(order => (
              <>
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-800">#{order.orderNumber}</td>
                  <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                    {(order as Order & { user?: { name: string; email: string } }).user
                      ? `${(order as Order & { user?: { name: string; email: string } }).user?.name}`
                      : '—'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.orderStatus}
                      onChange={e => updateStatus.mutate({ id: order._id, orderStatus: e.target.value })}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 focus:outline-none cursor-pointer ${orderStatusColor[order.orderStatus]}`}
                    >
                      {['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s} className="text-gray-800 bg-white capitalize">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      className="text-xs text-brand-700 hover:underline"
                    >
                      {expandedId === order._id ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expandedId === order._id && (
                  <tr key={`${order._id}-detail`} className="bg-gray-50">
                    <td colSpan={6} className="py-4 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-2">Items</p>
                          {order.items.map(item => (
                            <div key={item.variantSku} className="flex justify-between py-1 border-b border-gray-100">
                              <span className="text-gray-600">{item.name} × {item.quantity}</span>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold mb-2">Shipping Address</p>
                          <p className="text-gray-600">{order.shippingAddress.fullName}</p>
                          <p className="text-gray-500">{order.shippingAddress.line1}, {order.shippingAddress.city}</p>
                          <p className="text-gray-500">{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                          <p className="text-gray-500">📞 {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
