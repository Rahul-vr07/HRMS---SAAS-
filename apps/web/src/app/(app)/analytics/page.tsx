'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#06B6D4'];

const headcountTrend = [
  { month: 'Jan', count: 98 }, { month: 'Feb', count: 102 }, { month: 'Mar', count: 105 },
  { month: 'Apr', count: 108 }, { month: 'May', count: 110 }, { month: 'Jun', count: 112 },
  { month: 'Jul', count: 118 },
];

const attritionData = [
  { month: 'Jan', rate: 2.1 }, { month: 'Feb', rate: 1.8 }, { month: 'Mar', rate: 2.4 },
  { month: 'Apr', rate: 1.5 }, { month: 'May', rate: 2.0 }, { month: 'Jun', rate: 1.2 },
  { month: 'Jul', rate: 1.9 },
];

const genderData = [
  { name: 'Female', value: 45 },
  { name: 'Male', value: 48 },
  { name: 'Non-binary', value: 7 },
];

const leaveTrend = [
  { month: 'Jan', taken: 42 }, { month: 'Feb', taken: 38 }, { month: 'Mar', taken: 55 },
  { month: 'Apr', taken: 48 }, { month: 'May', taken: 62 }, { month: 'Jun', taken: 71 },
  { month: 'Jul', taken: 45 },
];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<any>('/dashboard'),
  });

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Workforce insights and trend analysis</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Headcount Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={headcountTrend}>
                <defs>
                  <linearGradient id="headcount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Area type="monotone" dataKey="count" stroke="#6366F1" fill="url(#headcount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Department Distribution</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[250px]" /> : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data?.departmentStats || []}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(data?.departmentStats || []).map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Gender Ratio</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Attrition Rate (%)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attritionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Leave Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={leaveTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Bar dataKey="taken" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
