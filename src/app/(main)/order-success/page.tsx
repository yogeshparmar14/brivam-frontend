'use client';
import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react';
import { Order } from '@/types';
import { formatPrice, orderStatusColor } from '@/lib/utils';
import api from '@/lib/api';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const { orderId } = use(searchParams);

  const { data: order } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/my/${orderId}`);
      return data.order;
    },
    enabled: !!orderId,
  });

  return (
    <div className="container-site py-16 max-w-2xl mx-auto text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your order. We&apos;ll send you a confirmation email shortly.
      </p>

      {order && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-left mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Order Number</p>
              <p className="text-lg font-bold text-brand-700">#{order.orderNumber}</p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${orderStatusColor[order.orderStatus]}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="space-y-2 mb-5">
            {order.items.map(item => (
              <div key={item.variantSku} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} × {item.quantity}</span>
                <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900">
              <span>Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
            <MapPin size={14} className="mt-0.5 shrink-0 text-brand-600" />
            <span>
              {order.shippingAddress.fullName}, {order.shippingAddress.line1},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders" className="btn-primary gap-2">
          <Package size={16} />
          Track Orders
        </Link>
        <Link href="/shop" className="btn-outline gap-2">
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
