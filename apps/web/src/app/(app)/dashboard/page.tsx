'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users, UserCheck, UserX, Clock, Wifi, CalendarOff,
  Briefcase, Ticket, Sparkles, ArrowRight, Cake, UserPlus,
  TrendingUp, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials, cn } from '@/lib/utils';
import { useUIStore, useAuthStore } from '@/lib/store';
import Link from 'next/link';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4'];

interface DashboardData {
  kpis: {
    employeeCount: number;
    presentToday: number;
    absentToday: number;
    lateToday: number;
    remoteToday: number;
    pendingLeaves: number;
    openJobs: number;
    pendingTickets: number;
    attendanceRate: number;
  };
  insights: Array<{ type: string; message: string; priority: string; action?: string }>;
  upcomingBirthdays: Array<{ id: string; firstName: string; lastName: string; birthday: string; department?: { name: string } }>;
  newJoinees: Array<{ id: string; firstName: string; lastName: string; jobTitle?: { title: string }; department?: { name: string } }>;
  leaveRequests: Array<{ id: string; days: number; employee: { firstName: string; lastName: string }; leaveType: { name: string } }>;
  announcements: Array<{ id: string; title: string; content: string; isPinned: boolean }>;
  departmentStats: Array<{ name: string; count: number }>;
  recentActivity: Array<{ id: string; action: string; entity: string; createdAt: string; user?: { firstName: string; lastName: string } }>;
}

const kpiConfig = [
  { key: 'employeeCount', label: 'Employees', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { key: 'presentToday', label: 'Present', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { key: 'absentToday', label: 'Absent', icon: UserX, color: 'text-red-500', bg: 'bg-red-500/10' },
  { key: 'lateToday', label: 'Late', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { key: 'remoteToday', label: 'Remote', icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { key: 'pendingLeaves', label: 'Leave Requests', icon: CalendarOff, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { key: 'openJobs', label: 'Open Roles', icon: Briefcase, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { key: 'pendingTickets', label: 'Tickets', icon: Ticket, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
] as const;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const setAiOpen = useUIStore((s) => s.setAiOpen);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/dashboard'),
  });

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName || 'there'}
          </h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening across your organization today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAiOpen(true)}>
            <Sparkles className="h-4 w-4 text-accent" /> Ask AI
          </Button>
          <Button asChild>
            <Link href="/employees">
              <UserPlus className="h-4 w-4" /> Add Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {kpiConfig.map((kpi, i) => (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                {isLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', kpi.bg)}>
                      <kpi.icon className={cn('h-4 w-4', kpi.color)} />
                    </div>
                    <p className="text-2xl font-bold tracking-tight">
                      {(data?.kpis as any)?.[kpi.key] ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* AI Insights */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-accent" /> AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                : data?.insights.map((insight, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-secondary/50',
                        insight.priority === 'high' && 'border-destructive/20 bg-destructive/5',
                      )}
                    >
                      <AlertCircle
                        className={cn(
                          'mt-0.5 h-4 w-4 shrink-0',
                          insight.priority === 'high' ? 'text-destructive' : 'text-primary',
                        )}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{insight.message}</p>
                      </div>
                      {insight.action && (
                        <Link href={insight.action}>
                          <Button variant="ghost" size="icon-sm">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data?.departmentStats || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                      }}
                    />
                    <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Pending Leave Requests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/leave">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-24 w-full" />
              ) : data?.leaveRequests.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No pending approvals</p>
              ) : (
                <div className="space-y-3">
                  {data?.leaveRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between rounded-xl border p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">
                            {getInitials(req.employee.firstName, req.employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {req.employee.firstName} {req.employee.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {req.leaveType.name} · {Number(req.days)} day{Number(req.days) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Attendance Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <Skeleton className="h-40 w-40 rounded-full" />
              ) : (
                <>
                  <div className="relative">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={[
                            { value: data?.kpis.attendanceRate || 0 },
                            { value: 100 - (data?.kpis.attendanceRate || 0) },
                          ]}
                          innerRadius={55}
                          outerRadius={70}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          <Cell fill="#6366F1" />
                          <Cell fill="hsl(var(--muted))" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{data?.kpis.attendanceRate || 0}%</p>
                        <p className="text-xs text-muted-foreground">Today</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm text-success">
                    <TrendingUp className="h-3.5 w-3.5" /> Healthy attendance
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Birthdays */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cake className="h-4 w-4 text-pink-500" /> Upcoming Birthdays
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : data?.upcomingBirthdays.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No upcoming birthdays</p>
              ) : (
                <div className="space-y-3">
                  {data?.upcomingBirthdays.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(b.firstName, b.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {b.firstName} {b.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{b.department?.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{b.birthday}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Joinees */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <UserPlus className="h-4 w-4 text-primary" /> New Joinees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <div className="space-y-3">
                  {data?.newJoinees.map((e) => (
                    <Link
                      key={e.id}
                      href={`/employees/${e.id}`}
                      className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-secondary"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(e.firstName, e.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {e.firstName} {e.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {e.jobTitle?.title} · {e.department?.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.announcements.map((a) => (
                <div key={a.id} className="rounded-xl border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-sm font-medium">{a.title}</p>
                    {a.isPinned && <Badge variant="secondary">Pinned</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
