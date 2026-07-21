'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, Plus } from 'lucide-react';

const documents = [
  { name: 'Employment Contract — Priya Sharma', type: 'Contract', expires: null, status: 'active' },
  { name: 'NDA — All Employees 2026', type: 'NDA', expires: null, status: 'active' },
  { name: 'Passport — Marcus Johnson', type: 'Passport', expires: '2027-03-15', status: 'active' },
  { name: 'Visa — David Kim', type: 'Visa', expires: '2026-09-01', status: 'expiring' },
  { name: 'Offer Letter — Emily Watson', type: 'Offer', expires: null, status: 'active' },
  { name: 'PAN Card — Aisha Patel', type: 'PAN', expires: null, status: 'active' },
  { name: 'Experience Letter Template', type: 'Template', expires: null, status: 'active' },
  { name: 'Health Insurance — Team', type: 'Certificate', expires: '2026-12-31', status: 'active' },
];

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Secure document management with expiry tracking</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Upload</Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-warning" />
        1 document expiring within 90 days — Visa for David Kim
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Documents</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((d) => (
                <tr key={d.name} className="border-b hover:bg-secondary/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary">{d.type}</Badge></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{d.expires || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.status === 'expiring' ? 'warning' : 'success'}>{d.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
