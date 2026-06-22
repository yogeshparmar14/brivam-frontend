'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('ojam_token', data.token);
        set({ user: data.user, token: data.token, isLoading: false });
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        const { data } = await api.post('/auth/register', { name, email, password, phone });
        localStorage.setItem('ojam_token', data.token);
        set({ user: data.user, token: data.token, isLoading: false });
      },

      logout: async () => {
        await api.post('/auth/logout').catch(() => {});
        localStorage.removeItem('ojam_token');
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),

      fetchMe: async () => {
        const { data } = await api.get('/auth/me');
        set({ user: data.user });
      },
    }),
    {
      name: 'ojam-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
