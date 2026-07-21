'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/store';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: unknown;
}

const suggestions = [
  'Who is absent today?',
  'Show pending leave requests',
  'What is our headcount?',
  'Find employees with React skills',
  'Summarize attendance',
];

export function AiPanel() {
  const { aiOpen, setAiOpen } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI HR Assistant. Ask me anything about your workforce — attendance, leave, payroll, recruitment, and more.",
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
      const res = await api.post<{ message: string; data?: unknown; suggestions?: string[] }>('/ai/chat', {
        message: text,
      });
      setMessages((m) => [...m, { role: 'assistant', content: res.message, data: res.data }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {aiOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setAiOpen(false)}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Assistant</p>
                  <p className="text-xs text-muted-foreground">Powered by Nexus AI</p>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setAiOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-foreground rounded-bl-md',
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about HR..."
                  className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
