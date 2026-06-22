'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import CartDrawer from './cart/CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <CartDrawer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'var(--font-inter)', fontSize: '0.875rem' },
          success: { iconTheme: { primary: '#3a9d72', secondary: '#fff' } },
        }}
      />
    </QueryClientProvider>
  );
}
