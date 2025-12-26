'use client';

import { useState, useEffect } from 'react';
import type { KeyConsideration, RiskFactor, UpcomingEvent } from '@/lib/hooks/use-reports';

// =============================================================================
// Types
// =============================================================================

interface SecondaryInfoRowProps {
  considerations: KeyConsideration[];
  risks: RiskFactor[];
  events: UpcomingEvent[];
  defaultExpanded?: boolean;
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getSeverityConfig(severity: string | undefined) {
  const configs: Record<string, { label: string; className: string }> = {
    high: { label: 'High', className: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
    medium: { label: 'Med', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
    low: { label: 'Low', className: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' },
  };
  return severity ? configs[severity] : configs.medium;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ConsiderationsColumnProps {
  considerations: KeyConsideration[];
}

function ConsiderationsColumn({ considerations }: ConsiderationsColumnProps) {
  const tailwinds = considerations.filter(c => c.type === 'tailwind').slice(0, 3);
  const headwinds = considerations.filter(c => c.type === 'headwind').slice(0, 3);
  
  // Interleave tailwinds and headwinds, max 3 total
  const items: KeyConsideration[] = [];
  const maxItems = 3;
  let tIdx = 0;
  let hIdx = 0;
  
  while (items.length < maxItems && (tIdx < tailwinds.length || hIdx < headwinds.length)) {
    if (tIdx < tailwinds.length) {
      items.push(tailwinds[tIdx]);
      tIdx++;
    }
    if (items.length < maxItems && hIdx < headwinds.length) {
      items.push(headwinds[hIdx]);
      hIdx++;
    }
  }

  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Key Considerations
        </h4>
        <p className="text-xs text-muted-foreground">No considerations available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Key Considerations
      </h4>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className={`shrink-0 text-sm ${
              item.type === 'tailwind' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {item.type === 'tailwind' ? '↑' : '↓'}
            </span>
            <p className="text-xs text-muted-foreground truncate">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RisksColumnProps {
  risks: RiskFactor[];
}

function RisksColumn({ risks }: RisksColumnProps) {
  const displayRisks = risks.slice(0, 3);

  if (displayRisks.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Risk Factors
        </h4>
        <p className="text-xs text-muted-foreground">No risks identified</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Risk Factors
      </h4>
      <div className="space-y-1.5">
        {displayRisks.map((risk, i) => {
          const severityConfig = getSeverityConfig(risk.severity);
          return (
            <div key={i} className="flex items-start gap-1.5">
              <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${severityConfig.className}`}>
                {severityConfig.label}
              </span>
              <p className="text-xs text-muted-foreground truncate flex-1">
                {risk.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface EventsColumnProps {
  events: UpcomingEvent[];
}

function EventsColumn({ events }: EventsColumnProps) {
  // Filter to future events and sort by date
  const futureEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (futureEvents.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Upcoming Events
        </h4>
        <p className="text-xs text-muted-foreground">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Upcoming Events
      </h4>
      <div className="space-y-1.5">
        {futureEvents.map((event, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="text-blue-500 shrink-0">📅</span>
              <p className="text-xs text-muted-foreground truncate">
                {event.event}
              </p>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
              {formatDate(event.date)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Chevron Icon Component
// =============================================================================

interface ChevronIconProps {
  expanded: boolean;
}

function ChevronIcon({ expanded }: ChevronIconProps) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function SecondaryInfoRow({
  considerations,
  risks,
  events,
  defaultExpanded,
}: SecondaryInfoRowProps) {
  // Determine if we're on mobile for default state
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default: expanded on desktop (>= 768px), collapsed on mobile
    if (defaultExpanded !== undefined) {
      setIsExpanded(defaultExpanded);
    } else {
      setIsExpanded(window.innerWidth >= 768);
    }
  }, [defaultExpanded]);

  // Check if there's any content to show
  const hasContent = considerations.length > 0 || risks.length > 0 || events.length > 0;

  if (!hasContent) {
    return null;
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="border rounded-lg bg-muted/30">
        <button
          className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          disabled
        >
          <span>More Details</span>
          <ChevronIcon expanded={false} />
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-muted/30 overflow-hidden">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isExpanded}
        aria-controls="secondary-info-content"
      >
        <span>More Details</span>
        <ChevronIcon expanded={isExpanded} />
      </button>

      {/* Collapsible Content */}
      <div
        id="secondary-info-content"
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'grid-rows-[1fr] opacity-100' 
            : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1">
            {/* 3-column grid on desktop, stacked on mobile */}
            <div className="grid gap-4 md:grid-cols-3">
              <ConsiderationsColumn considerations={considerations} />
              <RisksColumn risks={risks} />
              <EventsColumn events={events} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
