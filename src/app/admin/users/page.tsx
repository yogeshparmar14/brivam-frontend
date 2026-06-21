'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, UserCheck, UserX } from 'lucide-react';
import { User } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ users: User[]; total: number }>({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      const q = new URLSearchParams({ ...(search && { search }) });
      const { data } = await api.get(`/users?${q}`);
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.put(`/users/${id}/toggle`),
    onSuccess: () => {
      toast.success('User status updated');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return (
    <div className="space-y-5">
      <div className="relative w-64">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search users…"
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium">User</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Phone</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Role</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Joined</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={6} className="py-3 px-4"><div className="h-5 bg-gray-100 rounded animate-pulse" /></td></tr>
              ))
            ) : data?.users.map(user => (
              <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{user.phone || '—'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${user.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-400 hidden sm:table-cell">
                  {new Date(user.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="py-3 px-4">
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => toggleMutation.mutate(user._id)}
                      className={`p-1.5 rounded transition-colors ${user.isActive ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                      title={user.isActive ? 'Block user' : 'Activate user'}
                    >
                      {user.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
