'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, X, Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials, formatDate } from '@/lib/utils';

export default function LeavePage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: () => api.get<{ data: any[] }>('/leave/requests'),
  });

  const { data: holidays } = useQuery({
    queryKey: ['holidays'],
    queryFn: () => api.get<any[]>('/leave/holidays'),
  });

  const approve = useMutation({
    mutationFn: (id: string) => api.put(`/leave/requests/${id}/approve`),
    onSuccess: () => { toast.success('Leave approved'); qc.invalidateQueries({ queryKey: ['leave-requests'] }); },
  });

  const reject = useMutation({
    mutationFn: (id: string) => api.put(`/leave/requests/${id}/reject`, { reason: 'Not approved' }),
    onSuccess: () => { toast.success('Leave rejected'); qc.invalidateQueries({ queryKey: ['leave-requests'] }); },
  });

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
          <p className="text-muted-foreground">Approve requests and manage leave policies</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Request Leave</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leave Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)
                : data?.data?.length === 0
                  ? <p className="py-8 text-center text-sm text-muted-foreground">No leave requests</p>
                  : data?.data?.map((req: any) => (
                      <div key={req.id} className="flex items-center justify-between rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(req.employee.firstName, req.employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {req.employee.firstName} {req.employee.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {req.leaveType.name} · {Number(req.days)} day{Number(req.days) !== 1 ? 's' : ''} ·{' '}
                              {formatDate(req.startDate)} – {formatDate(req.endDate)}
                            </p>
                            {req.reason && <p className="mt-1 text-xs text-muted-foreground italic">{req.reason}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={req.status === 'PENDING' ? 'warning' : req.status === 'APPROVED' ? 'success' : 'destructive'}>
                            {req.status}
                          </Badge>
                          {req.status === 'PENDING' && (
                            <>
                              <Button size="icon-sm" variant="outline" className="text-success" onClick={() => approve.mutate(req.id)}>
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon-sm" variant="outline" className="text-destructive" onClick={() => reject.mutate(req.id)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Holiday Calendar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {holidays?.map((h: any) => (
              <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(h.date)}</p>
                </div>
                {h.isOptional && <Badge variant="secondary">Optional</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
