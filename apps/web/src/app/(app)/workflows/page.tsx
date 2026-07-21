'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';

const workflows = [
  { name: 'Leave Approval', type: 'Leave', steps: ['Employee Submit', 'Manager Review', 'HR Approve'], active: true },
  { name: 'Expense Reimbursement', type: 'Expense', steps: ['Submit', 'Manager', 'Finance', 'Payment'], active: true },
  { name: 'Recruitment Offer', type: 'Recruitment', steps: ['HR Draft', 'Hiring Manager', 'Finance', 'Candidate'], active: true },
  { name: 'Asset Request', type: 'Assets', steps: ['Employee', 'Manager', 'IT Provision'], active: false },
  { name: 'Document Approval', type: 'Documents', steps: ['Upload', 'HR Review', 'Legal'], active: true },
  { name: 'Payroll Processing', type: 'Payroll', steps: ['Generate', 'Finance Review', 'CEO Approve', 'Disburse'], active: true },
];

export default function WorkflowsPage() {
  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflow Builder</h1>
          <p className="text-muted-foreground">Drag-and-drop approval flows for every HR process</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Create Workflow</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {workflows.map((w) => (
          <Card key={w.name} className="cursor-pointer transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{w.name}</CardTitle>
                </div>
                <Badge variant={w.active ? 'success' : 'secondary'}>{w.active ? 'Active' : 'Draft'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-3">{w.type}</Badge>
              <div className="flex flex-wrap items-center gap-1">
                {w.steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-1">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium">{step}</span>
                    {i < w.steps.length - 1 && <span className="text-muted-foreground text-xs">→</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
