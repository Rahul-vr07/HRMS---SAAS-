'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  'Who is absent today?',
  'Show pending leave requests',
  'What is our headcount?',
  'Find employees with React skills',
  'Predict employee attrition',
  'Suggest promotions',
  'Summarize attendance',
  'Show recruitment pipeline',
];

export default function AiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI HR Assistant. I can answer questions about attendance, leave, payroll, recruitment, skills, attrition, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const res = await api.post<{ message: string }>('/ai/chat', { message: text });
      setMessages((m) => [...m, { role: 'assistant', content: res.message }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" /> AI Assistant
        </h1>
        <p className="text-muted-foreground">Natural language interface for your HR data</p>
      </div>

      <Card className="flex h-[calc(100vh-220px)] flex-col">
        <CardContent className="flex flex-1 flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary rounded-bl-md',
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-accent">
                      <Sparkles className="h-3 w-3" /> Nexus AI
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your HR data...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-6 pb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t p-4">
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex gap-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about your workforce..."
                className="flex-1 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="submit" size="lg" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
