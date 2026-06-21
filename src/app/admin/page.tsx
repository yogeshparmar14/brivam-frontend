'use client';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Users, TrendingUp, Package, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalUsers: number;
  revenueByMonth: { _id: { year: number; month: number }; revenue: number; orders: number }[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const { data: statsData } = useQuery<{ stats: Stats }>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/orders/stats');
      return data;
    },
  });

  const stats = statsData?.stats;

  const cards = [
    { label: 'Total Revenue', value: stats ? formatPrice(stats.totalRevenue) : '—', icon: TrendingUp, color: 'bg-green-50 text-green-600', link: '/admin/orders' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? '—', icon: Clock, color: 'bg-yellow-50 text-yellow-600', link: '/admin/orders?status=placed' },
    { label: 'Total Customers', value: stats?.totalUsers ?? '—', icon: Users, color: 'bg-purple-50 text-purple-600', link: '/admin/users' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={17} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </Link>
        ))}
      </div>

      {/* Revenue chart (simple table) */}
      {stats?.revenueByMonth && stats.revenueByMonth.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Revenue by Month</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">Month</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Orders</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.revenueByMonth.map(({ _id, orders, revenue }) => (
                  <tr key={`${_id.year}-${_id.month}`} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 text-gray-700">{MONTHS[_id.month - 1]} {_id.year}</td>
                    <td className="py-2.5 text-right text-gray-600">{orders}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">{formatPrice(revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn-primary py-2 px-4 text-sm gap-2">
            <Package size={15} /> Add Product
          </Link>
          <Link href="/admin/orders" className="btn-outline py-2 px-4 text-sm gap-2">
            <ShoppingBag size={15} /> View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
