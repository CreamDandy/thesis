'use client';

import { Badge } from '@/components/ui/badge';
import type { Signal } from '@/lib/hooks/use-stocks';

// =============================================================================
// Types
// =============================================================================

interface CompactSignalGridProps {
  signals: {
    timing: Signal | null;
    momentum: Signal | null;
    institutional: Signal | null;
    earnings: Signal | null;
    analyst: Signal | null;
    performance: Signal | null;
  };
}

// =============================================================================
// Signal Configuration
// =============================================================================

const SIGNAL_CONFIG: Record<string, { icon: string; name: string }> = {
  timing: { icon: '⏱️', name: 'Entry Timing' },
  momentum: { icon: '📈', name: 'Earnings Momentum' },
  institutional: { icon: '🏛️', name: 'Smart Money' },
  earnings: { icon: '📊', name: 'Earnings Quality' },
  analyst: { icon: '🎯', name: 'Analyst View' },
  performance: { icon: '📉', name: 'Price Action' },
};

const SIGNAL_ORDER = ['timing', 'momentum', 'institutional', 'earnings', 'analyst', 'performance'] as const;

// =============================================================================
// Helper Functions
// =============================================================================

function getStatusColor(status: 'bullish' | 'neutral' | 'bearish') {
  switch (status) {
    case 'bullish':
      return 'bg-green-500';
    case 'neutral':
      return 'bg-amber-500';
    case 'bearish':
      return 'bg-red-500';
  }
}

function getStrengthBadge(strength: string) {
  switch (strength) {
    case 'strong':
      return { label: 'Strong', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    case 'moderate':
      return { label: 'Mod', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    case 'weak':
      return { label: 'Weak', className: 'bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400' };
    default:
      return null;
  }
}

// =============================================================================
// Compact Signal Cell
// =============================================================================

interface SignalCellProps {
  signalKey: string;
  signal: Signal | null;
}

function SignalCell({ signalKey, signal }: SignalCellProps) {
  const config = SIGNAL_CONFIG[signalKey] || { icon: '📊', name: signalKey };

  if (!signal) {
    return (
      <div className="flex flex-col justify-center px-3 py-2 opacity-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{config.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">{config.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-muted" />
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">No data</p>
      </div>
    );
  }

  const statusColor = getStatusColor(signal.status);
  const strengthBadge = getStrengthBadge(signal.strength);

  return (
    <div className="group relative flex flex-col justify-center px-3 py-2 hover:bg-muted/50 transition-colors rounded">
      {/* Row 1: Icon + Name | Status dot + Strength badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm shrink-0">{config.icon}</span>
          <span className="text-xs font-medium truncate">{config.name}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {strengthBadge && (
            <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 ${strengthBadge.className}`}>
              {strengthBadge.label}
            </Badge>
          )}
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        </div>
      </div>

      {/* Row 2: Description (truncated) */}
      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
        {signal.description}
      </p>

      {/* Tooltip on hover - shows full insight */}
      <div className="absolute left-0 right-0 top-full z-50 hidden group-hover:block pt-1">
        <div className="bg-popover border rounded-md shadow-lg p-2 text-xs">
          <p className="font-medium mb-1">{signal.description}</p>
          <p className="text-muted-foreground">💡 {signal.insight}</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Compact Signal Grid Component
// =============================================================================

export function CompactSignalGrid({ signals }: CompactSignalGridProps) {
  return (
    <div className="w-full">
      {/* Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-border">
        {/* First row (or column on mobile) */}
        <div className="divide-y divide-border sm:divide-y lg:divide-y-0 lg:contents">
          <SignalCell signalKey="timing" signal={signals.timing} />
          <SignalCell signalKey="momentum" signal={signals.momentum} />
        </div>
        
        {/* Second row/column */}
        <div className="divide-y divide-border sm:divide-y lg:divide-y-0 lg:contents">
          <SignalCell signalKey="institutional" signal={signals.institutional} />
          <SignalCell signalKey="earnings" signal={signals.earnings} />
        </div>
        
        {/* Third row/column */}
        <div className="divide-y divide-border sm:divide-y lg:divide-y-0 lg:contents">
          <SignalCell signalKey="analyst" signal={signals.analyst} />
          <SignalCell signalKey="performance" signal={signals.performance} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Alternative: Simple Grid Layout (no dividers, uses background alternation)
// =============================================================================

export function CompactSignalGridAlt({ signals }: CompactSignalGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
      {SIGNAL_ORDER.map((key, index) => (
        <div 
          key={key} 
          className={`bg-background ${index % 2 === 0 ? '' : 'sm:bg-muted/20'}`}
        >
          <SignalCell signalKey={key} signal={signals[key]} />
        </div>
      ))}
    </div>
  );
}

export default CompactSignalGrid;
