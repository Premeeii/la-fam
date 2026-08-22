'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) { //children meaning component/page put in layout.tsx
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { 
      queries: 
      { 
        retry: 1, // if api query error will try 1 time before fail
        staleTime: 30_000 } }, //default cache time 30_000 ms
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
  );
}