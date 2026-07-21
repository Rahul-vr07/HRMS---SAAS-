'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const tickets = [
  { id: 'TKT-001', subject: 'Request for dual monitor setup', category: 'IT', priority: 'MEDIUM', status: 'OPEN', requester: 'Emily Watson' },
  { id: 'TKT-002', subject: 'Update bank account details', category: 'HR', priority: 'HIGH', status: 'IN_PROGRESS', requester: 'Sofia Martinez' },
  { id: 'TKT-003', subject: 'VPN access not working', category: 'IT', priority: 'URGENT', status: 'OPEN', requester: 'Ryan O\'Brien' },
  { id: 'TKT-004', subject: 'Request for WFH days', category: 'HR', priority: 'LOW', status: 'RESOLVED', requester: 'Jordan Lee' },
  { id: 'TKT-005', subject: 'Payroll discrepancy — June', category: 'HR', priority: 'HIGH', status: 'IN_PROGRESS', requester: 'James Wilson' },
];

export default function HelpdeskPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Helpdesk</h1>
          <p className="text-muted-foreground">Employee tickets and HR/IT requests</p>
        </div>
        <Button><Plus className="h-4 w-4" /> New Ticket</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Tickets</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requester</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-b hover:bg-secondary/50 cursor-pointer">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-3 text-sm font-medium">{t.subject}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{t.category}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge variant={t.priority === 'URGENT' ? 'destructive' : t.priority === 'HIGH' ? 'warning' : 'outline'}>
                      {t.priority}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={t.status === 'RESOLVED' ? 'success' : t.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{t.requester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
