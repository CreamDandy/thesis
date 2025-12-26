'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ValuationGaugeProps {
  verdict: 'undervalued' | 'fairly_valued' | 'overvalued' | null;
  currentPrice: number | null;
  fairValue: number | null;
  className?: string;
}

export function ValuationGauge({
  verdict,
  currentPrice,
  fairValue,
  className,
}: ValuationGaugeProps) {
  // Get verdict display config
  const getVerdictConfig = () => {
    if (!verdict) return { text: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted', icon: '—' };
    switch (verdict) {
      case 'undervalued':
        return { text: 'Undervalued', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500', icon: '↓' };
      case 'fairly_valued':
        return { text: 'Fair Value', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500', icon: '→' };
      case 'overvalued':
        return { text: 'Overvalued', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500', icon: '↑' };
      default:
        return { text: 'Unknown', color: 'text-muted-foreground', bg: 'bg-muted', icon: '—' };
    }
  };

  // Calculate percentage difference from fair value
  const getPriceDifference = () => {
    if (!currentPrice || !fairValue) return null;
    const diff = ((currentPrice - fairValue) / fairValue) * 100;
    return diff;
  };

  // Format currency
  const formatCurrency = (value: number | null): string => {
    if (value === null) return '--';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const verdictConfig = getVerdictConfig();
  const priceDiff = getPriceDifference();

  // Calculate position on the scale (0-100)
  // If we have fair value, position based on actual price difference
  // Otherwise use verdict-based positioning
  const getScalePosition = () => {
    if (priceDiff !== null) {
      // Map -30% to +30% difference to 0-100 scale
      // -30% = 0 (very undervalued), 0% = 50 (fair), +30% = 100 (very overvalued)
      const clampedDiff = Math.max(-30, Math.min(30, priceDiff));
      return ((clampedDiff + 30) / 60) * 100;
    }
    // Fallback to verdict-based
    if (!verdict) return 50;
    switch (verdict) {
      case 'undervalued': return 25;
      case 'fairly_valued': return 50;
      case 'overvalued': return 75;
      default: return 50;
    }
  };

  const scalePosition = getScalePosition();

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with verdict badge */}
      <div className="text-center mb-3">
        <div className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
          verdict === 'undervalued' && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
          verdict === 'fairly_valued' && 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
          verdict === 'overvalued' && 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
          !verdict && 'bg-muted text-muted-foreground'
        )}>
          <span>{verdictConfig.icon}</span>
          <span>{verdictConfig.text}</span>
        </div>
      </div>

      {/* Current Price - Large */}
      <div className="text-center mb-3">
        <div className="text-xl font-bold tracking-tight">
          {formatCurrency(currentPrice)}
        </div>
        {priceDiff !== null && (
          <div className={cn('text-[10px] font-medium', verdictConfig.color)}>
            {priceDiff > 0 ? '+' : ''}{priceDiff.toFixed(0)}% vs fair value
          </div>
        )}
      </div>

      {/* Visual Scale */}
      <div className="relative px-2 mb-2">
        {/* Background track with 3 zones */}
        <div className="h-2 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-emerald-400 dark:bg-emerald-600" />
          <div className="flex-1 bg-amber-400 dark:bg-amber-500" />
          <div className="flex-1 bg-red-400 dark:bg-red-600" />
        </div>

        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ left: `calc(${scalePosition}% - 6px)` }}
        >
          <div className={cn(
            'w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-md',
            verdictConfig.bg
          )} />
        </div>

        {/* Fair value marker (if available) */}
        {fairValue && (
          <div 
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: 'calc(50% - 1px)' }}
          >
            <div className="w-0.5 h-4 bg-slate-400 dark:bg-slate-500" />
          </div>
        )}
      </div>

      {/* Scale labels */}
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Cheap</span>
        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Fair</span>
        <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">Expensive</span>
      </div>

      {/* Fair Value Reference */}
      {fairValue ? (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Fair Value</span>
            <span className="text-xs font-semibold">{formatCurrency(fairValue)}</span>
          </div>
        </div>
      ) : (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="text-[10px] text-muted-foreground text-center">
            Based on P/E analysis
          </div>
        </div>
      )}
    </div>
  );
}
