'use client';

import { useQuery } from '@tanstack/react-query';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const { company, user } = useAuthStore();

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => api.get<any[]>('/companies/roles'),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get<{ data: any[] }>('/companies/audit-logs?limit=20'),
  });

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Company configuration, roles, and security</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Company Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue={company?.name || ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input defaultValue={company?.currency || 'USD'} />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input defaultValue="America/New_York" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Your Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input defaultValue={user?.firstName || ''} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input defaultValue={user?.lastName || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email || ''} disabled />
            </div>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Roles & Permissions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {roles?.map((role: any) => (
              <div key={role.id} className="flex items-center justify-between rounded-xl border p-3">
                <div>
                  <p className="text-sm font-medium">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.description}</p>
                </div>
                {role.isSystem && <Badge variant="secondary">System</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Audit Logs</CardTitle></CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {auditLogs?.data?.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                <div>
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground"> on {log.entity}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Integrations</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {['Google Calendar', 'Slack', 'Microsoft Teams', 'Zoom', 'Stripe', 'Twilio', 'AWS S3', 'Firebase'].map((name) => (
                <div key={name} className="flex items-center justify-between rounded-xl border p-4">
                  <span className="text-sm font-medium">{name}</span>
                  <Badge variant="outline">Connect</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
