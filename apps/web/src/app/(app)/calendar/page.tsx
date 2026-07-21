'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cake, CalendarOff, Users, Briefcase, GraduationCap, Wallet } from 'lucide-react';

const events = [
  { date: 'Jul 22', title: 'Sofia Martinez Birthday', type: 'birthday', icon: Cake },
  { date: 'Jul 22', title: 'Medical Leave — Sofia', type: 'leave', icon: CalendarOff },
  { date: 'Jul 23', title: 'Interview: Chris Anderson', type: 'recruitment', icon: Briefcase },
  { date: 'Jul 24', title: 'Security Awareness Training', type: 'training', icon: GraduationCap },
  { date: 'Jul 25', title: 'Q3 All-Hands Meeting', type: 'meeting', icon: Users },
  { date: 'Jul 25–27', title: 'Annual Leave — Emily Watson', type: 'leave', icon: CalendarOff },
  { date: 'Jul 28', title: 'Independence Day (Holiday)', type: 'holiday', icon: CalendarOff },
  { date: 'Jul 31', title: 'Payroll Processing Deadline', type: 'payroll', icon: Wallet },
];

const typeColors: Record<string, 'default' | 'success' | 'warning' | 'secondary' | 'destructive'> = {
  birthday: 'default',
  leave: 'warning',
  recruitment: 'success',
  training: 'secondary',
  meeting: 'default',
  holiday: 'destructive',
  payroll: 'warning',
};

export default function CalendarPage() {
  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Birthdays, leaves, meetings, training, and payroll events</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl border p-3 transition-colors hover:bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <e.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.date}</p>
                </div>
                <Badge variant={typeColors[e.type] || 'secondary'}>{e.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">July 2026</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <div key={d} className="py-1 font-medium text-muted-foreground">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const hasEvent = [22, 23, 24, 25, 28, 31].includes(day);
                const isToday = day === 21;
                return (
                  <div
                    key={day}
                    className={`relative rounded-lg py-2 ${isToday ? 'bg-primary text-primary-foreground font-bold' : hasEvent ? 'bg-primary/10 font-medium' : 'hover:bg-secondary'}`}
                  >
                    {day}
                    {hasEvent && !isToday && (
                      <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
