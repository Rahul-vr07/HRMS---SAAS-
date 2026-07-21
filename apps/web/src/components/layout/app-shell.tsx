'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { CommandPalette } from './command-palette';
import { AiPanel } from './ai-panel';
import { useAuthStore, useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('accessToken')) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main
        className={cn(
          'min-h-[calc(100vh-4rem)] p-6 transition-all duration-300',
          sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]',
        )}
      >
        <div className="mx-auto max-w-[1400px] animate-fade-in">{children}</div>
      </main>
      <CommandPalette />
      <AiPanel />
    </div>
  );
}
