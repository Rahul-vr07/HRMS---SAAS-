'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
  Users, LayoutDashboard, Clock, CalendarOff, Wallet, UserPlus,
  Settings, Sparkles, FileText, BarChart3, Search, Building2,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUIStore } from '@/lib/store';
import { api } from '@/lib/api';

const pages = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Organization', href: '/organization', icon: Building2 },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Leave', href: '/leave', icon: CalendarOff },
  { name: 'Payroll', href: '/payroll', icon: Wallet },
  { name: 'Recruitment', href: '/recruitment', icon: UserPlus },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useUIStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<{ results: SearchResult[] }>(`/search?q=${encodeURIComponent(q)}`);
      setResults(data.results);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const navigate = (href: string) => {
    setCommandOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="overflow-hidden p-0 max-w-xl">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search employees, leave, documents..."
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              {loading ? 'Searching...' : 'No results found.'}
            </Command.Empty>

            {results.length > 0 && (
              <Command.Group heading="Results">
                {results.map((r) => (
                  <Command.Item
                    key={`${r.type}-${r.id}`}
                    value={r.title}
                    onSelect={() => navigate(r.href)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm aria-selected:bg-accent/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-medium text-primary uppercase">
                      {r.type[0]}
                    </div>
                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Navigate">
              {pages.map((page) => (
                <Command.Item
                  key={page.href}
                  value={page.name}
                  onSelect={() => navigate(page.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm aria-selected:bg-accent/10"
                >
                  <page.icon className="h-4 w-4 text-muted-foreground" />
                  {page.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
