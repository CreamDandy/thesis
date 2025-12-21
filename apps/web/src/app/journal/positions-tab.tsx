'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockPositions } from './mock-data';
import type { ThesisStatus } from './types';

function getStatusBadgeVariant(
  status: ThesisStatus
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'needs-review':
      return 'secondary';
    case 'closed':
      return 'outline';
    default:
      return 'outline';
  }
}

function getStatusLabel(status: ThesisStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'needs-review':
      return 'Needs Review';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function calculatePL(position: {
  shares: number;
  avgCost: number;
  currentPrice: number;
}): { amount: number; percentage: number } {
  const amount =
    (position.currentPrice - position.avgCost) * position.shares;
  const percentage =
    ((position.currentPrice - position.avgCost) / position.avgCost) * 100;
  return { amount, percentage };
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} year(s) ago`;
}

export function PositionsTab() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {mockPositions.map((position) => {
        const pl = calculatePL(position);
        const isProfit = pl.amount >= 0;

        return (
          <Card key={position.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-3">
                    {position.ticker}
                    {position.thesis && (
                      <Badge
                        variant={getStatusBadgeVariant(position.thesis.status)}
                        className={
                          position.thesis.status === 'active'
                            ? 'bg-green-600 hover:bg-green-700'
                            : position.thesis.status === 'needs-review'
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                              : 'bg-gray-500 hover:bg-gray-600'
                        }
                      >
                        {getStatusLabel(position.thesis.status)}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {position.companyName}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.push(`/journal/${position.id}`)}
                  variant="outline"
                >
                  View/Edit Thesis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Entry Date</p>
                  <p className="font-medium">
                    {formatDate(position.entryDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shares</p>
                  <p className="font-medium">{position.shares}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Cost</p>
                  <p className="font-medium">
                    {formatCurrency(position.avgCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current P/L</p>
                  <p
                    className={`font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatCurrency(pl.amount)} ({formatPercentage(pl.percentage)})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Reviewed</p>
                  <p className="font-medium">
                    {position.thesis
                      ? getRelativeTime(position.thesis.lastReviewedDate)
                      : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {mockPositions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No positions yet. Add your first position to start tracking your
              investment theses.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
