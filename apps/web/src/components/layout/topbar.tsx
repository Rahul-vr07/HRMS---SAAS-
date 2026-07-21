'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Search, Bell, Sparkles, Moon, Sun, LogOut, User, Settings, Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useUIStore } from '@/lib/store';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Topbar() {
  const { user, logout } = useAuthStore();
  const { setCommandOpen, setAiOpen, sidebarCollapsed } = useUIStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAiOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setCommandOpen, setAiOpen]);

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-xl"
      style={{ marginLeft: sidebarCollapsed ? 68 : 260 }}
    >
      {/* Search trigger */}
      <button
        onClick={() => setCommandOpen(true)}
        className="flex h-9 flex-1 max-w-md items-center gap-2 rounded-lg border bg-secondary/50 px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" onClick={() => setAiOpen(true)} title="AI Assistant (⌘J)">
          <Sparkles className="h-4 w-4 text-accent" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-1 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user ? getInitials(user.firstName, user.lastName) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.role?.name || 'Admin'}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
