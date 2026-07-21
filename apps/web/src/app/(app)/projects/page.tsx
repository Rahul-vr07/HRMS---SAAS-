'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus } from 'lucide-react';
import { getInitials } from '@/lib/utils';

const projects = [
  {
    name: 'Nexus Platform v2',
    status: 'ACTIVE',
    progress: 72,
    members: ['Marcus Johnson', 'Priya Sharma', 'Emily Watson', 'David Kim'],
    tasks: { total: 48, done: 35 },
  },
  {
    name: 'Mobile App Launch',
    status: 'PLANNING',
    progress: 15,
    members: ['Alex Rivera', 'Jordan Lee'],
    tasks: { total: 24, done: 4 },
  },
  {
    name: 'Q3 Marketing Campaign',
    status: 'ACTIVE',
    progress: 40,
    members: ['Sofia Martinez', 'Lisa Nguyen'],
    tasks: { total: 16, done: 6 },
  },
];

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Projects, tasks, and timesheets</p>
        </div>
        <Button><Plus className="h-4 w-4" /> New Project</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.name} className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge variant={p.status === 'ACTIVE' ? 'success' : 'secondary'}>{p.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{p.progress}% complete</span>
                <span>{p.tasks.done}/{p.tasks.total} tasks</span>
              </div>
              <div className="flex -space-x-2">
                {p.members.slice(0, 4).map((m) => {
                  const [f, l] = m.split(' ');
                  return (
                    <Avatar key={m} className="h-7 w-7 border-2 border-card">
                      <AvatarFallback className="text-[9px]">{getInitials(f, l)}</AvatarFallback>
                    </Avatar>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
