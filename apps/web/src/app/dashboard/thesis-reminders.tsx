'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ThesisReminder {
  ticker: string;
  name: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

const reminders: ThesisReminder[] = [
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    reason: 'Price dropped 20% from your entry',
    severity: 'high',
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    reason: 'Earnings released yesterday',
    severity: 'medium',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    reason: '6 months since last review',
    severity: 'low',
  },
];

function getSeverityStyles(severity: ThesisReminder['severity']) {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
}

export function ThesisReminders() {
  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Thesis Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              No thesis reviews needed right now.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We&apos;ll notify you when it&apos;s time to review your positions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thesis Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.ticker}
              className="flex items-start justify-between gap-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/stocks/${reminder.ticker}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {reminder.ticker}
                  </Link>
                  <Badge
                    variant="outline"
                    className={getSeverityStyles(reminder.severity)}
                  >
                    {reminder.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{reminder.name}</p>
                <p className="text-sm">{reminder.reason}</p>
              </div>
              <Button asChild size="sm">
                <Link href={`/journal/${reminder.ticker}`}>Review Now</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
