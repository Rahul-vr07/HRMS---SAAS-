'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Laptop, Monitor, Smartphone, CreditCard, Plus } from 'lucide-react';

const assets = [
  { name: 'MacBook Pro 16"', type: 'Laptop', serial: 'MBP-2024-001', status: 'ASSIGNED', assignee: 'Priya Sharma', icon: Laptop },
  { name: 'Dell UltraSharp 27"', type: 'Monitor', serial: 'DEL-27-042', status: 'ASSIGNED', assignee: 'Emily Watson', icon: Monitor },
  { name: 'iPhone 15 Pro', type: 'Phone', serial: 'IP15-089', status: 'AVAILABLE', assignee: null, icon: Smartphone },
  { name: 'Employee ID Card', type: 'ID Card', serial: 'ID-0012', status: 'ASSIGNED', assignee: 'Lisa Nguyen', icon: CreditCard },
  { name: 'MacBook Air M3', type: 'Laptop', serial: 'MBA-2025-015', status: 'AVAILABLE', assignee: null, icon: Laptop },
  { name: 'LG 32" 4K', type: 'Monitor', serial: 'LG-32-007', status: 'MAINTENANCE', assignee: null, icon: Monitor },
];

export default function AssetsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground">Track company assets and assignments</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Add Asset</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <Card key={a.serial}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge variant={a.status === 'ASSIGNED' ? 'default' : a.status === 'AVAILABLE' ? 'success' : 'warning'}>
                  {a.status}
                </Badge>
              </div>
              <p className="font-medium">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.type} · {a.serial}</p>
              {a.assignee && (
                <p className="mt-2 text-xs text-muted-foreground">Assigned to {a.assignee}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
