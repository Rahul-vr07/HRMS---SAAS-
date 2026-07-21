'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials, formatCurrency } from '@/lib/utils';

const PIPELINE_COLORS: Record<string, string> = {
  APPLIED: 'bg-blue-500/10 border-blue-500/20',
  SCREENING: 'bg-violet-500/10 border-violet-500/20',
  INTERVIEW: 'bg-amber-500/10 border-amber-500/20',
  OFFER: 'bg-emerald-500/10 border-emerald-500/20',
  HIRED: 'bg-green-500/10 border-green-500/20',
  REJECTED: 'bg-red-500/10 border-red-500/20',
};

export default function RecruitmentPage() {
  const { data: pipeline, isLoading } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => api.get<any[]>('/recruitment/pipeline'),
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get<any[]>('/recruitment/jobs'),
  });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">Manage hiring pipeline and job postings</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Post Job</Button>
      </div>

      {/* Open Jobs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs?.filter((j: any) => j.status === 'OPEN').map((job: any) => (
          <Card key={job.id}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold">{job.title}</h3>
                <Badge variant="success">Open</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{job.location || 'Remote'}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{job._count?.candidates || 0} candidates</span>
                {job.salaryMin && (
                  <span className="font-medium">
                    {formatCurrency(Number(job.salaryMin))} – {formatCurrency(Number(job.salaryMax))}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Kanban */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiring Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {pipeline?.filter((col: any) => col.status !== 'REJECTED').map((col: any) => (
                <div key={col.status} className="min-w-[220px] flex-shrink-0">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.status}
                    </h4>
                    <Badge variant="secondary">{col.candidates.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {col.candidates.map((c: any) => (
                      <div
                        key={c.id}
                        className={`rounded-xl border p-3 ${PIPELINE_COLORS[col.status] || ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(c.firstName, c.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">{c.firstName} {c.lastName}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{c.jobPosting?.title}</p>
                        {c.rating && (
                          <div className="mt-1 flex gap-0.5">
                            {Array.from({ length: c.rating }).map((_, i) => (
                              <span key={i} className="text-amber-400 text-xs">★</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {col.candidates.length === 0 && (
                      <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                        No candidates
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
