'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, Clock, CalendarOff, Wallet,
  UserPlus, Target, GraduationCap, FileText, Laptop, HeadphonesIcon,
  FolderKanban, BarChart3, Sparkles, GitBranch, Calendar, Settings,
  ChevronLeft, ChevronRight, Network,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/ai', label: 'AI Assistant', icon: Sparkles },
      { href: '/calendar', label: 'Calendar', icon: Calendar },
    ],
  },
  {
    label: 'People',
    items: [
      { href: '/employees', label: 'Employees', icon: Users },
      { href: '/organization', label: 'Organization', icon: Building2 },
      { href: '/organization/org-chart', label: 'Org Chart', icon: Network },
    ],
  },
  {
    label: 'Time & Pay',
    items: [
      { href: '/attendance', label: 'Attendance', icon: Clock },
      { href: '/leave', label: 'Leave', icon: CalendarOff },
      { href: '/payroll', label: 'Payroll', icon: Wallet },
    ],
  },
  {
    label: 'Talent',
    items: [
      { href: '/recruitment', label: 'Recruitment', icon: UserPlus },
      { href: '/performance', label: 'Performance', icon: Target },
      { href: '/training', label: 'Training', icon: GraduationCap },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/assets', label: 'Assets', icon: Laptop },
      { href: '/helpdesk', label: 'Helpdesk', icon: HeadphonesIcon },
      { href: '/projects', label: 'Projects', icon: FolderKanban },
    ],
  },
  {
    label: 'Insights',
    items: [
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/workflows', label: 'Workflows', icon: GitBranch },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const company = useAuthStore((s) => s.company);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card/80 backdrop-blur-xl transition-all duration-300',
        sidebarCollapsed ? 'w-[68px]' : 'w-[260px]',
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-primary shadow-lift">
          <span className="text-sm font-bold text-white">N</span>
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="text-sm font-bold tracking-tight">Nexus HR</p>
            <p className="truncate text-xs text-muted-foreground">{company?.name || 'Enterprise'}</p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!sidebarCollapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all',
                        active
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                        sidebarCollapsed && 'justify-center px-2',
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <item.icon className={cn('h-[18px] w-[18px] shrink-0', active && 'text-primary')} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground',
            sidebarCollapsed && 'justify-center',
            pathname.startsWith('/settings') && 'bg-primary/10 text-primary',
          )}
        >
          <Settings className="h-[18px] w-[18px]" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="mt-1 w-full"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
