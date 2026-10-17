'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) { //children meaning component/page put in layout.tsx
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { 
      queries: 
      { 
        retry: 1, // if api query error will try 1 time before fail
        staleTime: 30_000 } }, //default cache time 30_000 ms
  }));

  const forcedTheme = pathname === '/' ? 'light' : undefined;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange
        forcedTheme={forcedTheme}
      >
        {children}
      <Toaster richColors position="top-center" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}