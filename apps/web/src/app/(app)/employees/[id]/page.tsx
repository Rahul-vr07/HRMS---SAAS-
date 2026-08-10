'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, Building2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials, formatDate, formatCurrency } from '@/lib/utils';


export default function EmployeeProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: emp, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => api.get<any>(`/employees/${id}`),
  });

  if (isLoading) {
    return (
      <AppShell>
        <Skeleton className="mb-6 h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </AppShell>
    );
  }

  if (!emp) {
    return (
      <AppShell>
        <p>Employee not found</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/employees">
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Link>
      </Button>

      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        <div className="h-24 gradient-primary" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
              <AvatarFallback className="text-2xl">
                {getInitials(emp.firstName, emp.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">
                  {emp.firstName} {emp.lastName}
                </h1>
                <Badge variant="success">{emp.status}</Badge>
              </div>
              <p className="text-muted-foreground">
                {emp.jobTitle?.title} · {emp.department?.name} · {emp.employeeCode}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button size="sm">Message</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left - Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {emp.email}
              </div>
              {emp.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {emp.phone}
                </div>
              )}
              {emp.city && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {emp.city}{emp.country ? `, ${emp.country}` : ''}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Joined {formatDate(emp.joinDate)}
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {emp.employmentType?.replace('_', ' ')}
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {emp.branch?.name || '—'}
              </div>
              {emp.manager && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(emp.manager.firstName, emp.manager.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  Reports to {emp.manager.firstName} {emp.manager.lastName}
                </div>
              )}
            </CardContent>
          </Card>

          {emp.skills?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {emp.skills.map((s: any) => (
                    <Badge key={s.id} variant="secondary">
                      {s.name} · L{s.level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {emp.salary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compensation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(Number(emp.salary.baseSalary))}</p>
                <p className="text-xs text-muted-foreground">Annual base salary</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right - Timeline & Leave */}
        <div className="space-y-6 lg:col-span-2">
          {emp.leaveBalances?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Leave Balances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {emp.leaveBalances.map((lb: any) => (
                    <div key={lb.id} className="rounded-xl border p-4 text-center">
                      <p className="text-2xl font-bold">{Number(lb.remaining)}</p>
                      <p className="text-xs text-muted-foreground">{lb.leaveType.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        of {Number(lb.total)} · used {Number(lb.used)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {emp.timeline?.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No events yet</p>
              ) : (
                <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
                  {emp.timeline?.map((event: any) => (
                    <div key={event.id} className="relative flex gap-4 pl-1">
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
