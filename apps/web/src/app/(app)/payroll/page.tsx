'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Play, Plus, FileText } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PayrollPage() {
  const qc = useQueryClient();

  const { data: runs, isLoading } = useQuery({
    queryKey: ['payroll-runs'],
    queryFn: () => api.get<any[]>('/payroll/runs'),
  });

  const { data: payslips } = useQuery({
    queryKey: ['payslips'],
    queryFn: () => api.get<any[]>('/payroll/payslips'),
  });

  const process = useMutation({
    mutationFn: (id: string) => api.put(`/payroll/runs/${id}/process`),
    onSuccess: () => {
      toast.success('Payroll processed successfully');
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
      qc.invalidateQueries({ queryKey: ['payslips'] });
    },
  });

  const createRun = useMutation({
    mutationFn: () => {
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return api.post('/payroll/runs', {
        period,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    },
    onSuccess: () => {
      toast.success('Payroll run created');
      qc.invalidateQueries({ queryKey: ['payroll-runs'] });
    },
  });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">Process salaries, generate payslips, and manage compensation</p>
        </div>
        <Button onClick={() => createRun.mutate()} disabled={createRun.isPending}>
          <Plus className="h-4 w-4" /> New Payroll Run
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payroll Runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
              : runs?.length === 0
                ? <p className="py-8 text-center text-sm text-muted-foreground">No payroll runs yet. Create one to get started.</p>
                : runs?.map((run: any) => (
                    <div key={run.id} className="flex items-center justify-between rounded-xl border p-4">
                      <div>
                        <p className="text-sm font-medium">{run.period}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(run.startDate)} – {formatDate(run.endDate)}
                          {run.employeeCount ? ` · ${run.employeeCount} employees` : ''}
                          {run.totalAmount ? ` · ${formatCurrency(Number(run.totalAmount))}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={run.status === 'COMPLETED' ? 'success' : run.status === 'DRAFT' ? 'secondary' : 'warning'}>
                          {run.status}
                        </Badge>
                        {run.status === 'DRAFT' && (
                          <Button size="sm" onClick={() => process.mutate(run.id)} disabled={process.isPending}>
                            <Play className="h-3.5 w-3.5" /> Process
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" /> Recent Payslips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!payslips?.length
              ? <p className="py-8 text-center text-sm text-muted-foreground">No payslips generated yet</p>
              : payslips?.slice(0, 10).map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-medium">
                        {p.employee.firstName} {p.employee.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{p.period} · {p.employee.employeeCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(Number(p.netSalary))}</p>
                      <p className="text-xs text-muted-foreground">Net</p>
                    </div>
                  </div>
                ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
