/**
 * Prompts for AI Stock Report Generation
 * 
 * These prompts are designed to generate institutional-quality stock analysis
 * that is accessible to retail investors.
 */

export const SYSTEM_PROMPT = `You are an expert equity research analyst creating stock reports for retail investors. Your reports should be:

1. **Plain English**: Avoid jargon. When you must use financial terms, explain them briefly.
2. **Balanced**: Present both bull and bear cases honestly. Don't be promotional.
3. **Specific**: Use concrete numbers, dates, and facts. Avoid vague statements.
4. **Actionable**: Help investors understand what to watch for and when.
5. **Honest about uncertainty**: Acknowledge when data is limited or conclusions are uncertain.

Your analysis should be grounded in:
- Recent financial statements and earnings calls
- Industry dynamics and competitive positioning
- Valuation relative to peers and history
- Near-term catalysts and risks

Never provide specific buy/sell recommendations or price targets as investment advice. Present analysis for educational purposes only.`;

export interface StockReportInput {
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  description: string;
  // Current data
  price: number;
  marketCap: number;
  // Valuation metrics
  pe: number | null;
  forwardPe: number | null;
  ps: number | null;
  pb: number | null;
  evEbitda: number | null;
  // Profitability
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  roe: number | null;
  roic: number | null;
  // Growth
  revenueGrowthYoY: number | null;
  epsGrowthYoY: number | null;
  // Dividends
  dividendYield: number | null;
  payoutRatio: number | null;
  // Balance sheet
  debtToEquity: number | null;
  currentRatio: number | null;
  // Recent news headlines
  recentNews: string[];
  // Analyst estimates
  analystTargetPrice: number | null;
  numberOfAnalysts: number | null;
}

export function buildStockReportPrompt(input: StockReportInput): string {
  const formatNumber = (n: number | null, suffix = ''): string => {
    if (n === null) return 'N/A';
    return `${n.toFixed(2)}${suffix}`;
  };

  const formatPercent = (n: number | null): string => {
    if (n === null) return 'N/A';
    return `${(n * 100).toFixed(1)}%`;
  };

  const formatMarketCap = (n: number): string => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    return `$${n.toFixed(0)}`;
  };

  return `Generate a comprehensive stock analysis report for ${input.ticker} (${input.companyName}).

## Company Overview
- **Sector**: ${input.sector}
- **Industry**: ${input.industry}
- **Description**: ${input.description}

## Current Market Data
- **Stock Price**: $${input.price.toFixed(2)}
- **Market Cap**: ${formatMarketCap(input.marketCap)}

## Valuation Metrics
- **P/E Ratio**: ${formatNumber(input.pe)}
- **Forward P/E**: ${formatNumber(input.forwardPe)}
- **P/S Ratio**: ${formatNumber(input.ps)}
- **P/B Ratio**: ${formatNumber(input.pb)}
- **EV/EBITDA**: ${formatNumber(input.evEbitda)}

## Profitability
- **Gross Margin**: ${formatPercent(input.grossMargin)}
- **Operating Margin**: ${formatPercent(input.operatingMargin)}
- **Net Margin**: ${formatPercent(input.netMargin)}
- **ROE**: ${formatPercent(input.roe)}
- **ROIC**: ${formatPercent(input.roic)}

## Growth
- **Revenue Growth (YoY)**: ${formatPercent(input.revenueGrowthYoY)}
- **EPS Growth (YoY)**: ${formatPercent(input.epsGrowthYoY)}

## Dividends
- **Dividend Yield**: ${formatPercent(input.dividendYield)}
- **Payout Ratio**: ${formatPercent(input.payoutRatio)}

## Financial Health
- **Debt/Equity**: ${formatNumber(input.debtToEquity)}
- **Current Ratio**: ${formatNumber(input.currentRatio)}

## Analyst Coverage
- **Average Target Price**: ${input.analystTargetPrice ? `$${input.analystTargetPrice.toFixed(2)}` : 'N/A'}
- **Number of Analysts**: ${input.numberOfAnalysts ?? 'N/A'}

## Recent News
${input.recentNews.length > 0 ? input.recentNews.map((n, i) => `${i + 1}. ${n}`).join('\n') : 'No recent news available.'}

---

Please provide your analysis in the following JSON format:

{
  "executiveSummary": "2-3 sentence overview of the company and current investment situation",
  "bullCase": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "bearCase": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"],
  "valuationAssessment": "2-3 paragraph analysis of current valuation vs history and peers",
  "valuationVerdict": "undervalued" | "fairly_valued" | "overvalued",
  "keyMetrics": [
    {"name": "Metric Name", "value": "Current Value", "explanation": "Why this matters for this stock"},
    ...
  ],
  "recentDevelopments": [
    {"date": "YYYY-MM-DD", "headline": "Brief headline", "summary": "1-2 sentence summary"},
    ...
  ],
  "catalystCalendar": [
    {"date": "YYYY-MM-DD", "event": "Event description", "type": "earnings|dividend|product|regulatory|other"},
    ...
  ]
}

Important guidelines:
1. Bull and bear cases should each have 3-5 specific, substantive points
2. Key metrics should include 5-7 most relevant metrics for THIS specific stock
3. Be specific with dates and numbers where possible
4. Valuation verdict should be based on multiple valuation methods, not just P/E
5. Recent developments should focus on material events from the last 30 days
6. Catalyst calendar should include known upcoming events (earnings, ex-div dates, etc.)`;
}

export const PERPLEXITY_RESEARCH_PROMPT = `You are a financial research assistant. Search for the most recent and relevant information about the given stock.

Focus on:
1. Recent earnings results and guidance
2. Major news and announcements (last 30 days)
3. Analyst upgrades/downgrades
4. Competitive developments
5. Industry trends affecting the company
6. Upcoming catalysts (earnings dates, product launches, regulatory decisions)

Provide factual, sourced information. Include dates for all events. Be specific about numbers and percentages.`;
