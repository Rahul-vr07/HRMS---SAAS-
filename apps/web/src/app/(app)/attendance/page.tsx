'use client';

import { useQuery } from '@tanstack/react-query';
import { UserCheck, UserX, Clock, Wifi, CalendarOff } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { getInitials, cn } from '@/lib/utils';

export default function AttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => api.get<any>('/attendance'),
  });

  const stats = [
    { label: 'Present', value: data?.stats?.present, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Absent', value: data?.stats?.absent, icon: UserX, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Late', value: data?.stats?.late, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Remote', value: data?.stats?.remote, icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'On Leave', value: data?.stats?.onLeave, icon: CalendarOff, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  const statusBadge = (s: string) => {
    const map: Record<string, 'success' | 'destructive' | 'warning' | 'default' | 'secondary'> = {
      PRESENT: 'success', ABSENT: 'destructive', LATE: 'warning', REMOTE: 'default', ON_LEAVE: 'secondary',
    };
    return map[s] || 'secondary';
  };

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Track and manage daily attendance</p>
        </div>
        <Button>Manual Entry</Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', s.bg)}>
                <s.icon className={cn('h-4 w-4', s.color)} />
              </div>
              {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{s.value ?? 0}</p>}
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Check In</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b"><td className="px-4 py-3" colSpan={5}><Skeleton className="h-8" /></td></tr>
                  ))
                : data?.records?.map((r: any) => (
                    <tr key={r.id} className="border-b hover:bg-secondary/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(r.employee.firstName, r.employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{r.employee.firstName} {r.employee.lastName}</p>
                            <p className="text-xs text-muted-foreground">{r.employee.employeeCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{r.employee.department?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm font-mono">
                        {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-4 py-3"><Badge variant={statusBadge(r.status)}>{r.status}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{r.method}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
