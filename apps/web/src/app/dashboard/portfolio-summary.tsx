'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const portfolioData = {
  totalValue: 125430.5,
  todayChange: 1234.56,
  todayChangePercent: 0.99,
  totalGain: 15430.5,
  totalGainPercent: 14.03,
  numberOfPositions: 6,
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formatCurrency(value)}`;
}

export function PortfolioSummary() {
  const isPositiveToday = portfolioData.todayChange >= 0;
  const isPositiveTotal = portfolioData.totalGain >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Value */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-3xl font-bold">
              {formatCurrency(portfolioData.totalValue)}
            </p>
          </div>

          {/* Today's Change */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Today&apos;s Change</p>
            <p
              className={`text-2xl font-semibold ${
                isPositiveToday ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatChange(portfolioData.todayChange)}
            </p>
            <p
              className={`text-sm ${
                isPositiveToday ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercent(portfolioData.todayChangePercent)}
            </p>
          </div>

          {/* Total Gain/Loss */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Gain/Loss</p>
            <p
              className={`text-2xl font-semibold ${
                isPositiveTotal ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatChange(portfolioData.totalGain)}
            </p>
            <p
              className={`text-sm ${
                isPositiveTotal ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercent(portfolioData.totalGainPercent)}
            </p>
          </div>

          {/* Number of Positions */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Positions</p>
            <p className="text-3xl font-bold">
              {portfolioData.numberOfPositions}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
