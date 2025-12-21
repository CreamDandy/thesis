'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const watchlistItems: WatchlistItem[] = [
  { ticker: 'META', name: 'Meta Platforms', price: 505.75, change: 8.25, changePercent: 1.66 },
  { ticker: 'AMD', name: 'AMD Inc.', price: 147.82, change: -2.18, changePercent: -1.45 },
  { ticker: 'CRM', name: 'Salesforce Inc.', price: 268.45, change: 3.12, changePercent: 1.18 },
  { ticker: 'NFLX', name: 'Netflix Inc.', price: 628.9, change: -5.35, changePercent: -0.84 },
  { ticker: 'UBER', name: 'Uber Technologies', price: 68.24, change: 1.45, changePercent: 2.17 },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function WatchlistPreview() {
  if (watchlistItems.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Watchlist</CardTitle>
          <Button size="sm" variant="outline">
            Add Stock
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Your watchlist is empty.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add stocks to track their performance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Watchlist</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Add Stock
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/watchlist">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {watchlistItems.map((item) => {
            const isPositive = item.change >= 0;

            return (
              <div
                key={item.ticker}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <Link
                    href={`/stocks/${item.ticker}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {item.ticker}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                  <p
                    className={`text-sm ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatChange(item.change)} ({formatPercent(item.changePercent)})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
