'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCompactNumber, type StockData } from '@/lib/mock-stock-data';

interface FinancialsTabProps {
  stock: StockData;
}

export function FinancialsTab({ stock }: FinancialsTabProps) {
  // Mock historical financial data
  const financialData = [
    {
      period: 'FY 2024',
      revenue: stock.revenue,
      netIncome: stock.netIncome,
      eps: stock.eps,
      fcf: stock.freeCashFlow,
    },
    {
      period: 'FY 2023',
      revenue: stock.revenue * 0.92,
      netIncome: stock.netIncome * 0.88,
      eps: stock.eps * 0.88,
      fcf: stock.freeCashFlow * 0.85,
    },
    {
      period: 'FY 2022',
      revenue: stock.revenue * 0.84,
      netIncome: stock.netIncome * 0.75,
      eps: stock.eps * 0.75,
      fcf: stock.freeCashFlow * 0.72,
    },
    {
      period: 'FY 2021',
      revenue: stock.revenue * 0.72,
      netIncome: stock.netIncome * 0.62,
      eps: stock.eps * 0.62,
      fcf: stock.freeCashFlow * 0.58,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Earnings Trend</CardTitle>
          <CardDescription>Historical financial performance visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
            <div className="text-center">
              <svg
                className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-muted-foreground font-medium">Interactive Charts Coming Soon</p>
              <p className="text-sm text-muted-foreground/75 mt-1">
                Revenue, earnings, and margin trends over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Metrics</CardTitle>
          <CardDescription>Annual financial performance data for {stock.ticker}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Net Income</TableHead>
                <TableHead className="text-right">EPS</TableHead>
                <TableHead className="text-right">Free Cash Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium">{row.period}</TableCell>
                  <TableCell className="text-right">{formatCompactNumber(row.revenue)}</TableCell>
                  <TableCell className="text-right">{formatCompactNumber(row.netIncome)}</TableCell>
                  <TableCell className="text-right">${row.eps.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatCompactNumber(row.fcf)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Profitability Metrics</CardTitle>
          <CardDescription>Margin analysis and efficiency ratios</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Industry Avg</TableHead>
                <TableHead className="text-right">5Y Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Gross Margin</TableCell>
                <TableCell className="text-right">{(stock.netMargin * 1.8).toFixed(1)}%</TableCell>
                <TableCell className="text-right">42.5%</TableCell>
                <TableCell className="text-right">{(stock.netMargin * 1.7).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Operating Margin</TableCell>
                <TableCell className="text-right">{(stock.netMargin * 1.2).toFixed(1)}%</TableCell>
                <TableCell className="text-right">22.1%</TableCell>
                <TableCell className="text-right">{(stock.netMargin * 1.15).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Net Margin</TableCell>
                <TableCell className="text-right">{stock.netMargin.toFixed(1)}%</TableCell>
                <TableCell className="text-right">15.8%</TableCell>
                <TableCell className="text-right">{(stock.netMargin * 0.95).toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ROE</TableCell>
                <TableCell className="text-right">{stock.roe.toFixed(1)}%</TableCell>
                <TableCell className="text-right">18.5%</TableCell>
                <TableCell className="text-right">{(stock.roe * 0.9).toFixed(1)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
