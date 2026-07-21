'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Star, TrendingUp } from 'lucide-react';

const goals = [
  { title: 'Increase NPS to 70', progress: 65, type: 'OKR', status: 'in_progress' },
  { title: 'Ship Platform v2', progress: 80, type: 'KPI', status: 'in_progress' },
  { title: 'Reduce attrition below 10%', progress: 45, type: 'OKR', status: 'in_progress' },
  { title: 'Complete security audit', progress: 100, type: 'KPI', status: 'completed' },
];

const reviews = [
  { name: 'Priya Sharma', rating: 5, period: 'Q2 2026', type: 'Manager Review' },
  { name: 'Emily Watson', rating: 4, period: 'Q2 2026', type: '360 Review' },
  { name: 'David Kim', rating: 5, period: 'Q2 2026', type: 'Peer Review' },
];

export default function PerformancePage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">Goals, OKRs, KPIs, and reviews</p>
        </div>
        <Button><Target className="h-4 w-4" /> New Goal</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" /> Goals & OKRs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((g) => (
              <div key={g.title} className="rounded-xl border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium">{g.title}</p>
                  <Badge variant={g.status === 'completed' ? 'success' : 'secondary'}>{g.type}</Badge>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{g.progress}% complete</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4" /> Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviews.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.period}</p>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              3 employees recommended for promotion based on performance
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
