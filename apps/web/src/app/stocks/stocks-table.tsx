'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  marketCap: number;
  pe: number;
}

interface StocksTableProps {
  stocks: Stock[];
}

type SortKey = 'ticker' | 'name' | 'sector' | 'price' | 'changePercent' | 'marketCap' | 'pe';
type SortDirection = 'asc' | 'desc';

function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function StocksTable({ stocks }: StocksTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [stocks, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('ticker')}
          >
            <div className="flex items-center">
              Ticker
              <SortIcon columnKey="ticker" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 hidden sm:table-cell"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center">
              Name
              <SortIcon columnKey="name" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 hidden md:table-cell"
            onClick={() => handleSort('sector')}
          >
            <div className="flex items-center">
              Sector
              <SortIcon columnKey="sector" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 text-right"
            onClick={() => handleSort('price')}
          >
            <div className="flex items-center justify-end">
              Price
              <SortIcon columnKey="price" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 text-right"
            onClick={() => handleSort('changePercent')}
          >
            <div className="flex items-center justify-end">
              Change %
              <SortIcon columnKey="changePercent" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 text-right hidden lg:table-cell"
            onClick={() => handleSort('marketCap')}
          >
            <div className="flex items-center justify-end">
              Market Cap
              <SortIcon columnKey="marketCap" />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer hover:bg-muted/50 text-right hidden md:table-cell"
            onClick={() => handleSort('pe')}
          >
            <div className="flex items-center justify-end">
              P/E
              <SortIcon columnKey="pe" />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedStocks.map((stock) => (
          <TableRow key={stock.ticker}>
            <TableCell className="font-medium">
              <Link
                href={`/stocks/${stock.ticker}`}
                className="text-primary hover:underline"
              >
                {stock.ticker}
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{stock.name}</TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge variant="secondary">{stock.sector}</Badge>
            </TableCell>
            <TableCell className="text-right">{formatPrice(stock.price)}</TableCell>
            <TableCell
              className={cn(
                'text-right font-medium',
                stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {formatChangePercent(stock.changePercent)}
            </TableCell>
            <TableCell className="text-right hidden lg:table-cell">
              {formatMarketCap(stock.marketCap)}
            </TableCell>
            <TableCell className="text-right hidden md:table-cell">
              {stock.pe.toFixed(1)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
