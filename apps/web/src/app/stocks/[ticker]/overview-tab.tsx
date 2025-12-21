'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  formatCompactNumber,
  formatCurrency,
  formatPercent,
  formatVolume,
  type StockData,
} from '@/lib/mock-stock-data';

interface OverviewTabProps {
  stock: StockData;
}

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function OverviewTab({ stock }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Key Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
          <CardDescription>
            Financial metrics and valuation data for {stock.ticker}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Valuation Metrics */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Valuation
              </h4>
              <StatItem label="Market Cap" value={formatCompactNumber(stock.marketCap)} />
              <StatItem label="P/E Ratio" value={stock.pe.toFixed(2)} />
              <StatItem label="Forward P/E" value={stock.forwardPE.toFixed(2)} />
              <StatItem label="EPS" value={formatCurrency(stock.eps)} />
            </div>

            {/* Dividends & Returns */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Dividends & Returns
              </h4>
              <StatItem
                label="Dividend Yield"
                value={stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
              />
              <StatItem
                label="Payout Ratio"
                value={stock.payoutRatio > 0 ? `${stock.payoutRatio.toFixed(1)}%` : 'N/A'}
              />
              <StatItem label="ROE" value={`${stock.roe.toFixed(1)}%`} />
              <StatItem label="Net Margin" value={`${stock.netMargin.toFixed(1)}%`} />
            </div>

            {/* Trading Data */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Trading Data
              </h4>
              <StatItem label="52-Week High" value={formatCurrency(stock.weekHigh52)} />
              <StatItem label="52-Week Low" value={formatCurrency(stock.weekLow52)} />
              <StatItem label="Volume" value={formatVolume(stock.volume)} />
              <StatItem label="Avg Volume" value={formatVolume(stock.avgVolume)} />
            </div>

            {/* Financial Health */}
            <div className="space-y-1 md:col-span-2 lg:col-span-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Financial Health
              </h4>
              <div className="grid gap-6 md:grid-cols-3">
                <StatItem label="Debt/Equity" value={`${stock.debtToEquity.toFixed(1)}%`} />
                <StatItem label="Revenue (TTM)" value={formatCompactNumber(stock.revenue)} />
                <StatItem label="Free Cash Flow" value={formatCompactNumber(stock.freeCashFlow)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Description */}
      <Card>
        <CardHeader>
          <CardTitle>About {stock.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{stock.description}</p>
        </CardContent>
      </Card>

      {/* Analyst Ratings (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Analyst Ratings</CardTitle>
          <CardDescription>Consensus recommendations from Wall Street analysts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 hover:bg-green-600">Buy</Badge>
              <span className="text-sm text-muted-foreground">12 analysts</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Hold</Badge>
              <span className="text-sm text-muted-foreground">8 analysts</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Sell</Badge>
              <span className="text-sm text-muted-foreground">2 analysts</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Average Price Target: <span className="font-medium text-foreground">{formatCurrency(stock.price * 1.15)}</span>
            {' '}(+15.0% upside)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
