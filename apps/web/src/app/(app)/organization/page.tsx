'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';

export default function OrganizationPage() {
  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => api.get<any[]>('/organization/departments'),
  });

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: () => api.get<any[]>('/organization/branches'),
  });

  const { data: titles } = useQuery({
    queryKey: ['job-titles'],
    queryFn: () => api.get<any[]>('/organization/job-titles'),
  });

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Organization</h1>
        <p className="text-muted-foreground">Departments, branches, and job titles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" /> Departments
            </CardTitle>
            <Button size="sm" variant="outline">Add</Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {departments?.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.code}</p>
                    </div>
                    <Badge variant="secondary">{d._count?.employees || 0} people</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" /> Branches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {branches?.map((b: any) => (
                <div key={b.id} className="rounded-xl border p-3">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{b.name}</p>
                    {b.isHeadquarters && <Badge>HQ</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {b.city}{b.country ? `, ${b.country}` : ''} · {b._count?.employees || 0} employees
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4" /> Job Titles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {titles?.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-secondary/50">
                  <div>
                    <p className="text-sm">{t.title}</p>
                    {t.level && <p className="text-xs text-muted-foreground">{t.level}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{t._count?.employees || 0}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
