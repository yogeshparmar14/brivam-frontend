'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, orderStatusColor } from '@/lib/utils';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const { data, isLoading } = useQuery<{ orders: Order[]; total: number }>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my');
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return (
    <div className="container-site py-16">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-site py-10 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {data?.orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-sm mb-6">Start shopping to see your orders here</p>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders.map(order => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${orderStatusColor[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                </p>
                <Link href={`/account/orders/${order._id}`} className="flex items-center gap-1 text-sm text-brand-700 font-medium hover:gap-2 transition-all">
                  Details <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
