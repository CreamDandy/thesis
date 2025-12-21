'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const GICS_SECTORS = [
  'Communication Services',
  'Consumer Discretionary',
  'Consumer Staples',
  'Energy',
  'Financials',
  'Health Care',
  'Industrials',
  'Information Technology',
  'Materials',
  'Real Estate',
  'Utilities',
] as const;

const MARKET_CAP_OPTIONS = [
  { value: 'all', label: 'All Market Caps' },
  { value: 'large', label: 'Large Cap (>$100B)' },
  { value: 'mid', label: 'Mid Cap ($10B-$100B)' },
  { value: 'small', label: 'Small Cap (<$10B)' },
] as const;

export interface FilterState {
  search: string;
  sector: string;
  marketCap: string;
  peMin: string;
  peMax: string;
}

const defaultFilters: FilterState = {
  search: '',
  sector: 'all',
  marketCap: 'all',
  peMin: '',
  peMax: '',
};

export function StocksFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // TODO: Implement filter application when connected to real data
    console.log('Applying filters:', filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.sector !== 'all' ||
    filters.marketCap !== 'all' ||
    filters.peMin !== '' ||
    filters.peMax !== '';

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search Input */}
          <div className="space-y-2 lg:col-span-1">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Ticker or name..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Sector Filter */}
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Select
              value={filters.sector}
              onValueChange={(value) => handleFilterChange('sector', value)}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {GICS_SECTORS.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Market Cap Filter */}
          <div className="space-y-2">
            <Label htmlFor="marketCap">Market Cap</Label>
            <Select
              value={filters.marketCap}
              onValueChange={(value) => handleFilterChange('marketCap', value)}
            >
              <SelectTrigger id="marketCap">
                <SelectValue placeholder="All Market Caps" />
              </SelectTrigger>
              <SelectContent>
                {MARKET_CAP_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* P/E Range */}
          <div className="space-y-2">
            <Label>P/E Ratio</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                className="w-full"
                value={filters.peMin}
                onChange={(e) => handleFilterChange('peMin', e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                className="w-full"
                value={filters.peMax}
                onChange={(e) => handleFilterChange('peMax', e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-end gap-2">
            <Button onClick={handleApply} className="flex-1">
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="flex-1"
            >
              <X className="mr-1 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
