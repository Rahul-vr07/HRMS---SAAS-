'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Plus, Filter, MoreHorizontal } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import { getInitials, formatDate } from '@/lib/utils';

interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  joinDate: string;
  department?: { name: string };
  jobTitle?: { title: string };
  branch?: { name: string };
}

export default function EmployeesPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['employees', search],
    queryFn: () =>
      api.get<{ data: Employee[]; meta: { total: number } }>(
        `/employees?search=${encodeURIComponent(search)}&limit=50`,
      ),
  });

  const statusVariant = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
      ACTIVE: 'success',
      PROBATION: 'warning',
      ON_LEAVE: 'secondary',
      TERMINATED: 'destructive',
    };
    return map[status] || 'secondary';
  };

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            {data?.meta.total ?? '...'} people in your organization
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 border-b p-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-3" colSpan={6}>
                          <Skeleton className="h-10 w-full" />
                        </td>
                      </tr>
                    ))
                  : data?.data.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b transition-colors hover:bg-secondary/50"
                      >
                        <td className="px-4 py-3">
                          <Link href={`/employees/${emp.id}`} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs">
                                {getInitials(emp.firstName, emp.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {emp.firstName} {emp.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {emp.employeeCode} · {emp.email}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm">{emp.department?.name || '—'}</td>
                        <td className="px-4 py-3 text-sm">{emp.jobTitle?.title || '—'}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusVariant(emp.status)}>{emp.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(emp.joinDate)}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
