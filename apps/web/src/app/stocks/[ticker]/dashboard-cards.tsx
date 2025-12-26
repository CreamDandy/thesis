'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { 
  ActionSummary, 
  ScenarioAnalysis, 
  BusinessOverview, 
  AnalystConsensus 
} from '@/lib/hooks/use-reports';
import type { Stock } from '@thesis/db';

// =============================================================================
// Helper Functions
// =============================================================================

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(0)}%`;
}

function getRecommendationConfig(rec: ActionSummary['recommendation']) {
  const configs = {
    strong_buy: { label: 'STRONG BUY', className: 'bg-emerald-600 text-white' },
    buy: { label: 'BUY', className: 'bg-green-600 text-white' },
    hold: { label: 'HOLD', className: 'bg-amber-500 text-white' },
    sell: { label: 'SELL', className: 'bg-orange-600 text-white' },
    strong_sell: { label: 'STRONG SELL', className: 'bg-red-600 text-white' },
  };
  return configs[rec];
}

// =============================================================================
// Component 1: CompactActionSummary
// =============================================================================

interface CompactActionSummaryProps {
  actionSummary: ActionSummary | null;
  currentPrice: number | null;
}

export function CompactActionSummary({ actionSummary, currentPrice }: CompactActionSummaryProps) {
  if (!actionSummary) {
    return (
      <Card className="min-h-[180px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[160px]">
          <p className="text-sm text-muted-foreground">No action summary available</p>
        </CardContent>
      </Card>
    );
  }

  const recConfig = getRecommendationConfig(actionSummary.recommendation);
  const convictionPercent = (actionSummary.conviction / 10) * 100;

  // Build trigger badges from thesisMonitors or legacy conditions
  const triggers: { label: string; type: 'upgrade' | 'downgrade' }[] = [];
  
  if (actionSummary.thesisMonitors) {
    actionSummary.thesisMonitors.upgradeConditions.slice(0, 1).forEach(cond => {
      triggers.push({ label: `↑ ${cond.slice(0, 20)}...`, type: 'upgrade' });
    });
    actionSummary.thesisMonitors.downgradeConditions.slice(0, 1).forEach(cond => {
      triggers.push({ label: `↓ ${cond.slice(0, 20)}...`, type: 'downgrade' });
    });
  } else if (actionSummary.upgradeConditions || actionSummary.downgradeConditions) {
    actionSummary.upgradeConditions?.slice(0, 1).forEach(cond => {
      triggers.push({ label: `↑ ${cond.slice(0, 20)}...`, type: 'upgrade' });
    });
    actionSummary.downgradeConditions?.slice(0, 1).forEach(cond => {
      triggers.push({ label: `↓ ${cond.slice(0, 20)}...`, type: 'downgrade' });
    });
  }

  return (
    <Card className="min-h-[180px] border-2 border-blue-500/30 bg-blue-500/5">
      <CardContent className="p-4 flex flex-col">
        {/* Header: Recommendation + Conviction */}
        <div className="flex items-center justify-between mb-3">
          <Badge className={`text-base px-4 py-1.5 ${recConfig.className}`}>
            {recConfig.label}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Conviction</span>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${convictionPercent}%` }}
              />
            </div>
            <span className="text-sm font-medium">{actionSummary.conviction}/10</span>
          </div>
        </div>

        {/* Rationale - 2-3 lines truncated */}
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {actionSummary.rationale}
        </p>

        {/* Trigger Badges */}
        {triggers.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {triggers.map((trigger, i) => (
              <Badge
                key={i}
                variant="outline"
                className={`text-xs px-2 py-0.5 ${
                  trigger.type === 'upgrade'
                    ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400'
                    : 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400'
                }`}
              >
                {trigger.label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Component 2: ScenarioAnalysisCompact
// =============================================================================

interface ScenarioAnalysisCompactProps {
  scenarioAnalysis: ScenarioAnalysis | null;
  currentPrice: number | null;
}

export function ScenarioAnalysisCompact({ scenarioAnalysis, currentPrice }: ScenarioAnalysisCompactProps) {
  if (!scenarioAnalysis) {
    return (
      <Card className="min-h-[200px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[180px]">
          <p className="text-sm text-muted-foreground">No scenario analysis available</p>
        </CardContent>
      </Card>
    );
  }

  const { bullCase, baseCase, bearCase, expectedValue, riskAdjustedScore, commentary } = scenarioAnalysis;

  const formatUpside = (target: number) => {
    if (!currentPrice) return '';
    const pct = ((target - currentPrice) / currentPrice * 100);
    return formatPercent(pct);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'bg-green-600';
    if (score >= 5) return 'bg-amber-500';
    return 'bg-red-600';
  };

  const maxProbability = Math.max(bullCase.probability, baseCase.probability, bearCase.probability);

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Scenarios</CardTitle>
          <Badge className={`${getScoreColor(riskAdjustedScore)} text-white text-xs`}>
            {riskAdjustedScore.toFixed(1)}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-2.5">
        {/* Bull Case Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-green-600 font-medium">Bull</span>
          <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden relative">
            <div
              className="h-full bg-green-500 rounded-sm"
              style={{ width: `${(bullCase.probability / maxProbability) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {bullCase.probability}%
            </span>
          </div>
          <span className="text-sm font-mono w-16 text-right">${bullCase.targetPrice.toFixed(0)}</span>
          <span className="text-xs text-green-600 w-12">{formatUpside(bullCase.targetPrice)}</span>
        </div>

        {/* Base Case Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-muted-foreground font-medium">Base</span>
          <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden relative">
            <div
              className="h-full bg-slate-400 rounded-sm"
              style={{ width: `${(baseCase.probability / maxProbability) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {baseCase.probability}%
            </span>
          </div>
          <span className="text-sm font-mono w-16 text-right">${baseCase.targetPrice.toFixed(0)}</span>
          <span className="text-xs w-12">{formatUpside(baseCase.targetPrice)}</span>
        </div>

        {/* Bear Case Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs w-10 text-red-600 font-medium">Bear</span>
          <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden relative">
            <div
              className="h-full bg-red-500 rounded-sm"
              style={{ width: `${(bearCase.probability / maxProbability) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
              {bearCase.probability}%
            </span>
          </div>
          <span className="text-sm font-mono w-16 text-right">${bearCase.targetPrice.toFixed(0)}</span>
          <span className="text-xs text-red-600 w-12">{formatUpside(bearCase.targetPrice)}</span>
        </div>

        {/* Expected Value & Commentary */}
        <div className="pt-2 border-t flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Expected Value</span>
            <p className="text-base font-semibold">
              ${expectedValue.toFixed(0)}
              {currentPrice && (
                <span className={`text-xs ml-1 ${expectedValue > currentPrice ? 'text-green-600' : 'text-red-600'}`}>
                  ({formatUpside(expectedValue)})
                </span>
              )}
            </p>
          </div>
          {commentary && (
            <p className="text-xs text-muted-foreground max-w-[50%] text-right line-clamp-2">
              {commentary}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Component 3: TargetPriceCard
// =============================================================================

interface TargetPriceCardProps {
  targetPriceAnalysis?: ActionSummary['targetPriceAnalysis'];
  valuationZones?: ActionSummary['valuationZones'];
  riskManagement?: ActionSummary['riskManagement'];
}

export function TargetPriceCard({ targetPriceAnalysis, valuationZones, riskManagement }: TargetPriceCardProps) {
  if (!targetPriceAnalysis && !valuationZones) {
    return (
      <Card className="min-h-[200px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[180px]">
          <p className="text-sm text-muted-foreground">No target price data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-medium">Target Prices</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Compact Target Price Table */}
        {targetPriceAnalysis && (
          <div className="text-xs">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1.5 font-medium text-muted-foreground">Method</th>
                  <th className="text-right py-1.5 font-medium text-muted-foreground">Target</th>
                  <th className="text-right py-1.5 font-medium text-muted-foreground">Upside</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed">
                  <td className="py-1.5">Analyst</td>
                  <td className="text-right font-mono">${targetPriceAnalysis.analystConsensus.price.toFixed(0)}</td>
                  <td className="text-right">{targetPriceAnalysis.analystConsensus.upside}</td>
                </tr>
                <tr className="border-b border-dashed">
                  <td className="py-1.5">PE Stable</td>
                  <td className="text-right font-mono">${targetPriceAnalysis.peStableCase.price.toFixed(0)}</td>
                  <td className="text-right">{targetPriceAnalysis.peStableCase.upside}</td>
                </tr>
                <tr className="border-b border-dashed">
                  <td className="py-1.5">PE Reversion</td>
                  <td className="text-right font-mono">${targetPriceAnalysis.peReversionCase.price.toFixed(0)}</td>
                  <td className={`text-right ${targetPriceAnalysis.peReversionCase.upside.startsWith('-') ? 'text-red-600' : ''}`}>
                    {targetPriceAnalysis.peReversionCase.upside}
                  </td>
                </tr>
                <tr className={targetPriceAnalysis.hurdleRate.meetsHurdle ? 'bg-green-50 dark:bg-green-950/20' : 'bg-amber-50 dark:bg-amber-950/20'}>
                  <td className="py-1.5 font-medium">Hurdle</td>
                  <td className="text-right font-mono font-medium">${targetPriceAnalysis.hurdleRate.requiredPrice?.toFixed(0)}</td>
                  <td className="text-right">
                    {targetPriceAnalysis.hurdleRate.meetsHurdle ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-amber-600">✗</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Valuation Zones */}
        {valuationZones && (
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
              <p className="text-xs text-muted-foreground">Buy</p>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                &lt;${valuationZones.buyZone.maxPrice?.toFixed(0)}
              </p>
            </div>
            <div className="text-center p-2 bg-slate-50 dark:bg-slate-950/30 rounded border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-muted-foreground">Hold</p>
              <p className="text-sm font-semibold">
                ${valuationZones.holdZone.minPrice?.toFixed(0)}-${valuationZones.holdZone.maxPrice?.toFixed(0)}
              </p>
            </div>
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-800">
              <p className="text-xs text-muted-foreground">Sell</p>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                &gt;${valuationZones.sellZone.minPrice?.toFixed(0)}
              </p>
            </div>
          </div>
        )}

        {/* Risk Management Summary */}
        {riskManagement && (
          <div className="flex items-center justify-between text-xs pt-1 border-t">
            <span className="text-muted-foreground">
              Stop: <span className="font-medium text-foreground">${riskManagement.stopLoss.toFixed(0)}</span>
            </span>
            <span className="text-muted-foreground">
              Size: <span className="font-medium text-foreground">{riskManagement.maxPositionSize}</span>
            </span>
            <span className="text-muted-foreground">
              R/R: <span className={`font-medium ${riskManagement.riskRewardRatio >= 1 ? 'text-green-600' : 'text-amber-600'}`}>
                1:{riskManagement.riskRewardRatio.toFixed(1)}
              </span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Component 4: BusinessOverviewCompact
// =============================================================================

interface BusinessOverviewCompactProps {
  businessOverview: BusinessOverview | null;
  stock: Stock;
}

export function BusinessOverviewCompact({ businessOverview, stock }: BusinessOverviewCompactProps) {
  if (!businessOverview) {
    return (
      <Card className="min-h-[160px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[140px]">
          <p className="text-sm text-muted-foreground">No business overview available</p>
        </CardContent>
      </Card>
    );
  }

  const maxSegmentPercentage = Math.max(
    ...businessOverview.revenueSegments.map(s => parseFloat(s.percentage) || 0)
  );

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-medium">{stock.name}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Description - 2-3 sentences truncated */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {businessOverview.description}
        </p>

        {/* Revenue Segments as mini bars */}
        {businessOverview.revenueSegments.length > 0 && (
          <div className="space-y-1.5">
            {businessOverview.revenueSegments.slice(0, 2).map((seg, i) => {
              const percent = parseFloat(seg.percentage) || 0;
              const width = maxSegmentPercentage > 0 ? (percent / maxSegmentPercentage) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-20 truncate">{seg.segment}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-sm"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-10 text-right">{seg.percentage}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Key Metrics as large numbers */}
        {businessOverview.keyMetrics.length > 0 && (
          <div className="flex items-center gap-6 pt-1">
            {businessOverview.keyMetrics.slice(0, 2).map((metric, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Component 5: AnalystConsensusCompact
// =============================================================================

interface AnalystConsensusCompactProps {
  consensus: AnalystConsensus | null;
}

export function AnalystConsensusCompact({ consensus }: AnalystConsensusCompactProps) {
  if (!consensus) {
    return (
      <Card className="min-h-[160px] border-2 border-dashed border-muted">
        <CardContent className="flex items-center justify-center min-h-[140px]">
          <p className="text-sm text-muted-foreground">No analyst consensus available</p>
        </CardContent>
      </Card>
    );
  }

  const { rating, targetPrice, currentPrice, upside: providedUpside, buyCount, holdCount, sellCount } = consensus;
  const totalAnalysts = (buyCount ?? 0) + (holdCount ?? 0) + (sellCount ?? 0);

  // Use provided upside or calculate it
  const upside = providedUpside || (targetPrice && currentPrice
    ? `${((targetPrice - currentPrice) / currentPrice * 100).toFixed(1)}%`
    : null);

  // Calculate percentages for visual representation
  const buyPercent = totalAnalysts > 0 ? ((buyCount ?? 0) / totalAnalysts) * 100 : 0;
  const holdPercent = totalAnalysts > 0 ? ((holdCount ?? 0) / totalAnalysts) * 100 : 0;
  const sellPercent = totalAnalysts > 0 ? ((sellCount ?? 0) / totalAnalysts) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Analyst Consensus</CardTitle>
          {rating && (
            <Badge variant="outline" className="text-xs">
              {rating}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Visual Stacked Bar for Buy/Hold/Sell */}
        {totalAnalysts > 0 && (
          <div className="space-y-1.5">
            <div className="h-7 rounded-md overflow-hidden flex">
              {buyPercent > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center"
                  style={{ width: `${buyPercent}%` }}
                >
                  {buyPercent >= 15 && (
                    <span className="text-xs text-white font-medium">{buyCount}</span>
                  )}
                </div>
              )}
              {holdPercent > 0 && (
                <div
                  className="bg-amber-400 flex items-center justify-center"
                  style={{ width: `${holdPercent}%` }}
                >
                  {holdPercent >= 15 && (
                    <span className="text-xs text-white font-medium">{holdCount}</span>
                  )}
                </div>
              )}
              {sellPercent > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center"
                  style={{ width: `${sellPercent}%` }}
                >
                  {sellPercent >= 15 && (
                    <span className="text-xs text-white font-medium">{sellCount}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Buy {buyCount ?? 0}</span>
              <span>Hold {holdCount ?? 0}</span>
              <span>Sell {sellCount ?? 0}</span>
            </div>
          </div>
        )}

        {/* Target Price with Upside */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="text-xs text-muted-foreground">Price Target</p>
            <p className="text-xl font-semibold">{formatCurrency(targetPrice)}</p>
          </div>
          {upside && (
            <Badge
              variant="outline"
              className={`text-sm ${
                upside.startsWith('-')
                  ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
                  : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200'
              }`}
            >
              {upside.startsWith('-') || upside.startsWith('+') ? '' : '+'}{upside}
            </Badge>
          )}
        </div>

        {/* Total Analysts */}
        {totalAnalysts > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Based on {totalAnalysts} analyst{totalAnalysts !== 1 ? 's' : ''}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
