'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials } from '@/lib/utils';

export default function OrgChartPage() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['org-chart'],
    queryFn: () => api.get<any[]>('/organization/org-chart'),
  });

  const roots = employees?.filter((e) => !e.managerId) || [];
  const getChildren = (id: string) => employees?.filter((e) => e.managerId === id) || [];

  const Node = ({ emp, depth = 0 }: { emp: any; depth?: number }) => {
    const children = getChildren(emp.id);
    return (
      <div className="flex flex-col items-center">
        <div className="rounded-xl border bg-card p-4 shadow-soft text-center min-w-[180px] transition-all hover:shadow-md hover:-translate-y-0.5">
          <Avatar className="mx-auto mb-2 h-12 w-12">
            <AvatarFallback>{getInitials(emp.firstName, emp.lastName)}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold">{emp.firstName} {emp.lastName}</p>
          <p className="text-xs text-muted-foreground">{emp.jobTitle?.title}</p>
          <p className="text-[10px] text-muted-foreground">{emp.department?.name}</p>
        </div>
        {children.length > 0 && (
          <>
            <div className="h-6 w-px bg-border" />
            <div className="flex gap-6 relative">
              {children.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-px bg-border" style={{ top: 0 }} />
              )}
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="h-2 w-px bg-border" />
                  <Node emp={child} depth={depth + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Organization Chart</h1>
        <p className="text-muted-foreground">Visual hierarchy of your organization</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Hierarchy</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="flex flex-wrap justify-center gap-8 overflow-x-auto py-8">
              {roots.map((emp) => (
                <Node key={emp.id} emp={emp} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
