'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Award } from 'lucide-react';

const courses = [
  { title: 'Leadership Essentials', category: 'Leadership', duration: '8h', progress: 60, mandatory: false },
  { title: 'Security Awareness 2026', category: 'Compliance', duration: '1h', progress: 100, mandatory: true },
  { title: 'Effective Communication', category: 'Soft Skills', duration: '4h', progress: 0, mandatory: false },
  { title: 'Data Privacy Fundamentals', category: 'Compliance', duration: '2h', progress: 30, mandatory: true },
  { title: 'Advanced TypeScript', category: 'Technical', duration: '12h', progress: 45, mandatory: false },
  { title: 'Product Thinking', category: 'Product', duration: '6h', progress: 0, mandatory: false },
];

export default function TrainingPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Training & Learning</h1>
          <p className="text-muted-foreground">Courses, learning paths, and certificates</p>
        </div>
        <Button><BookOpen className="h-4 w-4" /> Browse Catalog</Button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Courses Enrolled', value: '6', icon: GraduationCap },
          { label: 'Completed', value: '1', icon: Award },
          { label: 'Hours Learned', value: '14.5', icon: BookOpen },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.title} className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardHeader className="pb-2">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{c.category}</Badge>
                {c.mandatory && <Badge variant="warning">Mandatory</Badge>}
              </div>
              <CardTitle className="text-base">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">{c.duration}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.progress === 0 ? 'Not started' : c.progress === 100 ? 'Completed' : `${c.progress}% complete`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
