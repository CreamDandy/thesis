'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatPercent, type StockData } from '@/lib/mock-stock-data';

interface StockHeaderProps {
  stock: StockData;
}

export function StockHeader({ stock }: StockHeaderProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {stock.name}
          </h1>
          <Badge variant="secondary">{stock.sector}</Badge>
        </div>
        <p className="text-muted-foreground text-lg">{stock.ticker}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(stock.price)}
          </span>
          <span
            className={`text-lg font-medium ${
              isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {formatCurrency(stock.change)} ({formatPercent(stock.changePercent)})
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            // Placeholder - will be implemented with watchlist functionality
            console.log('Add to watchlist:', stock.ticker);
          }}
        >
          Add to Watchlist
        </Button>
      </div>
    </div>
  );
}
