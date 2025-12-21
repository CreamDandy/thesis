'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Position {
  ticker: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}

const positions: Position[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', shares: 50, avgCost: 145.0, currentPrice: 178.5 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', shares: 30, avgCost: 280.0, currentPrice: 378.25 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', shares: 20, avgCost: 120.0, currentPrice: 141.8 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', shares: 25, avgCost: 145.0, currentPrice: 178.35 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', shares: 15, avgCost: 450.0, currentPrice: 495.22 },
  { ticker: 'TSLA', name: 'Tesla Inc.', shares: 10, avgCost: 275.0, currentPrice: 248.5 },
];

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

function calculateGainLoss(position: Position): { gain: number; percent: number } {
  const totalCost = position.shares * position.avgCost;
  const currentValue = position.shares * position.currentPrice;
  const gain = currentValue - totalCost;
  const percent = ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
  return { gain, percent };
}

export function PositionsList() {
  if (positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any positions yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Start by adding stocks to your portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Avg Cost</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Gain/Loss</TableHead>
              <TableHead className="text-right">Gain %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((position) => {
              const { gain, percent } = calculateGainLoss(position);
              const isPositive = gain >= 0;

              return (
                <TableRow key={position.ticker}>
                  <TableCell>
                    <Link
                      href={`/stocks/${position.ticker}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {position.ticker}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {position.name}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">{position.shares}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(position.avgCost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(position.currentPrice)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {formatCurrency(gain)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatPercent(percent)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
