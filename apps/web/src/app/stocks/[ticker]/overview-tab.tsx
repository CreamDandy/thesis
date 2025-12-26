'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignals, type Signal } from '@/lib/hooks/use-stocks';
import { useReport, useBrief, type ResearchBriefData, type ActionSummary } from '@/lib/hooks/use-reports';
import type { Stock } from '@thesis/db';

// Import compact components
import { SignalScoreGauge } from '@/components/ui/signal-score-gauge';
import { ValuationGauge } from '@/components/ui/valuation-gauge';
import {
  CompactActionSummary,
  ScenarioAnalysisCompact,
  TargetPriceCard,
  BusinessOverviewCompact,
  AnalystConsensusCompact,
} from './dashboard-cards';
import { CompactSignalGrid } from './signal-grid';
import { SecondaryInfoRow } from './secondary-info-row';

// =============================================================================
// Types
// =============================================================================

interface OverviewTabProps {
  stock: Stock;
}

type ValuationVerdict = 'undervalued' | 'fairly_valued' | 'overvalued';

// =============================================================================
// Helper Functions
// =============================================================================

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'TBD';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// =============================================================================
// Loading Skeletons (Compact versions for bento grid)
// =============================================================================

function HeroRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Action Summary - spans 2 cols on desktop */}
      <Card className="lg:col-span-2">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardContent>
      </Card>
      {/* Signal Score Gauge */}
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center py-6">
          <Skeleton className="h-20 w-40 rounded-t-full" />
          <Skeleton className="h-8 w-16 mt-2" />
          <Skeleton className="h-4 w-24 mt-1" />
        </CardContent>
      </Card>
      {/* Valuation Gauge */}
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center py-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-20 mt-2" />
          <Skeleton className="h-3 w-full mt-4" />
          <Skeleton className="h-4 w-20 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

function AnalysisRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
          <Skeleton className="h-6 w-32 mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContextRowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-3 mt-2">
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-14" />
              <Skeleton className="h-8 w-14" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SignalsRowSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-2 p-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// MetricsToWatch Component (inline for Row 3)
// =============================================================================

interface MetricsToWatchProps {
  keyMetricsToWatch?: ActionSummary['thesisMonitors'];
}

function MetricsToWatch({ keyMetricsToWatch }: MetricsToWatchProps) {
  const metrics = keyMetricsToWatch?.keyMetricsToWatch;

  if (!metrics || metrics.length === 0) {
    return (
      <Card className="min-h-[160px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[140px]">
          <p className="text-sm text-muted-foreground">No key metrics to watch</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-medium">Key Metrics to Watch</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {metrics.slice(0, 3).map((metric, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{metric.metric}</span>
              <Badge variant="outline" className="font-mono text-xs">
                {metric.current}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs gap-4">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Bullish:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {metric.bullishIf}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Bearish:</span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {metric.bearishIf}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function OverviewTab({ stock }: OverviewTabProps) {
  const { data: signals, isLoading: signalsLoading } = useSignals(stock.ticker);
  const { data: report, isLoading: reportLoading } = useReport(stock.ticker);
  const { data: brief, isLoading: briefLoading } = useBrief(stock.ticker);

  const isLoading = signalsLoading || reportLoading || briefLoading;

  // Get current price from various sources
  const currentPrice = brief?.analystConsensus?.currentPrice ?? report?.valuationDetails?.currentPrice ?? null;

  // Get valuation verdict
  const valuationVerdict = (report?.valuationVerdict ?? brief?.investmentThesis?.verdict ?? null) as ValuationVerdict | null;

  return (
    <div className="space-y-4">
      {/* =================================================================== */}
      {/* ROW 1: Hero Row - Most critical info */}
      {/* =================================================================== */}
      {isLoading ? (
        <HeroRowSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action Summary - spans 2 cols on desktop */}
          <div className="lg:col-span-2">
            <CompactActionSummary
              actionSummary={brief?.actionSummary ?? null}
              currentPrice={currentPrice}
            />
          </div>

          {/* Signal Score Gauge */}
          <Card>
            <CardContent className="flex items-center justify-center p-3">
              {signals?.compositeScore ? (
                <SignalScoreGauge
                  score={signals.compositeScore.score}
                  label={signals.compositeScore.label}
                  bullishCount={signals.bullishCount}
                  neutralCount={signals.neutralCount}
                  bearishCount={signals.bearishCount}
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No signal data
                </div>
              )}
            </CardContent>
          </Card>

          {/* Valuation Gauge */}
          <Card>
            <CardContent className="p-4">
              <ValuationGauge
                verdict={valuationVerdict}
                currentPrice={currentPrice}
                fairValue={report?.valuationDetails?.fairValueEstimate ?? null}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* =================================================================== */}
      {/* ROW 2: Analysis Row - Scenarios and targets */}
      {/* =================================================================== */}
      {isLoading ? (
        <AnalysisRowSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScenarioAnalysisCompact
            scenarioAnalysis={brief?.scenarioAnalysis ?? null}
            currentPrice={currentPrice}
          />
          <TargetPriceCard
            targetPriceAnalysis={brief?.actionSummary?.targetPriceAnalysis}
            valuationZones={brief?.actionSummary?.valuationZones}
            riskManagement={brief?.actionSummary?.riskManagement}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* ROW 3: Context Row - Business, metrics, consensus */}
      {/* =================================================================== */}
      {isLoading ? (
        <ContextRowSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BusinessOverviewCompact
            businessOverview={brief?.businessOverview ?? null}
            stock={stock}
          />
          <MetricsToWatch
            keyMetricsToWatch={brief?.actionSummary?.thesisMonitors}
          />
          <AnalystConsensusCompact
            consensus={brief?.analystConsensus ?? null}
          />
        </div>
      )}

      {/* =================================================================== */}
      {/* ROW 4: Signals Row - Detailed signal grid */}
      {/* =================================================================== */}
      {isLoading ? (
        <SignalsRowSkeleton />
      ) : signals?.signals ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span>Signal Intelligence</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                Real-time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <CompactSignalGrid signals={signals.signals} />
          </CardContent>
        </Card>
      ) : null}

      {/* =================================================================== */}
      {/* ROW 5: Secondary Info (collapsible) */}
      {/* =================================================================== */}
      {brief && (
        <SecondaryInfoRow
          considerations={brief.keyConsiderations ?? []}
          risks={brief.riskFactors ?? []}
          events={brief.upcomingEvents ?? []}
        />
      )}

      {/* =================================================================== */}
      {/* Footer: Brief metadata */}
      {/* =================================================================== */}
      {brief?.generatedAt && (
        <p className="text-xs text-muted-foreground text-right">
          Research brief generated {formatDate(brief.generatedAt)}
          {brief.isExpired && (
            <span className="text-amber-600 ml-2">(Expired - refresh recommended)</span>
          )}
        </p>
      )}
    </div>
  );
}
