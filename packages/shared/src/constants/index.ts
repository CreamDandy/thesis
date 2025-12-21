// =============================================================================
// S&P 100 Tickers (Phase 1 Coverage)
// =============================================================================

export const SP100_TICKERS = [
  'AAPL', 'ABBV', 'ABT', 'ACN', 'ADBE', 'AIG', 'AMD', 'AMGN', 'AMT', 'AMZN',
  'AVGO', 'AXP', 'BA', 'BAC', 'BK', 'BKNG', 'BLK', 'BMY', 'BRK.B', 'C',
  'CAT', 'CHTR', 'CL', 'CMCSA', 'COF', 'COP', 'COST', 'CRM', 'CSCO', 'CVS',
  'CVX', 'DE', 'DHR', 'DIS', 'DOW', 'DUK', 'EMR', 'EXC', 'F', 'FDX',
  'GD', 'GE', 'GILD', 'GM', 'GOOG', 'GOOGL', 'GS', 'HD', 'HON', 'IBM',
  'INTC', 'JNJ', 'JPM', 'KHC', 'KO', 'LIN', 'LLY', 'LMT', 'LOW', 'MA',
  'MCD', 'MDLZ', 'MDT', 'MET', 'META', 'MMM', 'MO', 'MRK', 'MS', 'MSFT',
  'NEE', 'NFLX', 'NKE', 'NVDA', 'ORCL', 'PEP', 'PFE', 'PG', 'PM', 'PYPL',
  'QCOM', 'RTX', 'SBUX', 'SCHW', 'SO', 'SPG', 'T', 'TGT', 'TMO', 'TMUS',
  'TSLA', 'TXN', 'UNH', 'UNP', 'UPS', 'USB', 'V', 'VZ', 'WFC', 'WMT', 'XOM',
] as const;

export type SP100Ticker = typeof SP100_TICKERS[number];

// =============================================================================
// GICS Sectors
// =============================================================================

export const GICS_SECTORS = {
  'Communication Services': ['GOOGL', 'GOOG', 'META', 'NFLX', 'DIS', 'CMCSA', 'VZ', 'T', 'TMUS', 'CHTR'],
  'Consumer Discretionary': ['AMZN', 'TSLA', 'HD', 'MCD', 'NKE', 'LOW', 'SBUX', 'TGT', 'BKNG', 'F', 'GM'],
  'Consumer Staples': ['PG', 'KO', 'PEP', 'COST', 'WMT', 'PM', 'MO', 'MDLZ', 'CL', 'KHC'],
  'Energy': ['XOM', 'CVX', 'COP'],
  'Financials': ['JPM', 'BAC', 'WFC', 'GS', 'MS', 'BLK', 'SCHW', 'AXP', 'C', 'USB', 'BK', 'COF', 'MET', 'AIG', 'SPG'],
  'Health Care': ['UNH', 'JNJ', 'LLY', 'PFE', 'ABBV', 'MRK', 'TMO', 'ABT', 'DHR', 'BMY', 'AMGN', 'GILD', 'CVS', 'MDT'],
  'Industrials': ['CAT', 'HON', 'UNP', 'UPS', 'BA', 'RTX', 'DE', 'LMT', 'GE', 'GD', 'EMR', 'FDX', 'MMM'],
  'Information Technology': ['AAPL', 'MSFT', 'NVDA', 'AVGO', 'ORCL', 'CRM', 'ADBE', 'AMD', 'CSCO', 'ACN', 'INTC', 'IBM', 'TXN', 'QCOM', 'PYPL', 'MA', 'V'],
  'Materials': ['LIN', 'DOW'],
  'Real Estate': ['AMT'],
  'Utilities': ['NEE', 'DUK', 'SO', 'EXC'],
} as const;

export type GICSSector = keyof typeof GICS_SECTORS;

// =============================================================================
// Strategy Templates
// =============================================================================

export const STRATEGY_TEMPLATES = {
  dividend_growth: {
    name: 'Dividend Growth',
    description: 'Focus on companies with consistent dividend increases',
    defaultCriteria: {
      minYield: 2,
      maxPayoutRatio: 60,
      minDividendYears: 10,
    },
    typicalHoldPeriod: '5yr' as const,
  },
  quality_growth: {
    name: 'Quality Growth',
    description: 'High-quality companies with strong growth prospects',
    defaultCriteria: {
      minRoe: 15,
      minRevenueGrowth: 10,
      maxDebtToEquity: 1,
    },
    typicalHoldPeriod: '2yr' as const,
  },
  deep_value: {
    name: 'Deep Value',
    description: 'Undervalued companies trading below intrinsic value',
    defaultCriteria: {
      maxPe: 15,
      maxPb: 1.5,
      minFcfYield: 5,
    },
    typicalHoldPeriod: '1yr' as const,
  },
  momentum: {
    name: 'Momentum',
    description: 'Stocks with strong price momentum and relative strength',
    defaultCriteria: {
      min52WeekPosition: 80,
      minRelativeStrength: 70,
    },
    typicalHoldPeriod: '6mo' as const,
  },
} as const;

// =============================================================================
// Thesis Review Triggers
// =============================================================================

export const THESIS_REVIEW_TRIGGERS = {
  price_drop_20: {
    name: 'Price Drop 20%',
    description: 'Stock has fallen 20% or more from entry price',
    threshold: -0.20,
  },
  earnings: {
    name: 'Earnings Release',
    description: 'Company has released quarterly earnings',
  },
  catalyst_passed: {
    name: 'Catalyst Date Passed',
    description: 'A catalyst date you specified has passed',
  },
  staleness_6mo: {
    name: 'Thesis Staleness',
    description: 'Thesis has not been reviewed in 6 months',
    thresholdDays: 180,
  },
} as const;

// =============================================================================
// Report Update Triggers
// =============================================================================

export const REPORT_UPDATE_TRIGGERS = {
  earnings: {
    name: 'Earnings Release',
    description: 'Update within 24 hours of earnings filing',
    priority: 1,
  },
  major_news: {
    name: 'Major News',
    description: 'CEO change, acquisition, regulatory action',
    priority: 2,
  },
  price_move: {
    name: 'Price Move',
    description: 'Stock moves more than 10% in a week',
    threshold: 0.10,
    priority: 3,
  },
  estimate_revision: {
    name: 'Estimate Revision',
    description: 'Analyst estimates revised by more than 5%',
    threshold: 0.05,
    priority: 4,
  },
  weekly_refresh: {
    name: 'Weekly Refresh',
    description: 'Automatic weekly update (Sunday night)',
    priority: 5,
  },
} as const;

// =============================================================================
// API Rate Limits
// =============================================================================

export const RATE_LIMITS = {
  alphaVantage: {
    requestsPerMinute: 5,
    requestsPerDay: 500, // Premium tier
  },
  fmp: {
    requestsPerMinute: 10,
    requestsPerDay: 250, // Free tier
  },
  newsApi: {
    requestsPerDay: 100, // Free tier (dev only)
  },
  openai: {
    requestsPerMinute: 60,
    tokensPerMinute: 90000,
  },
  perplexity: {
    requestsPerMinute: 20,
  },
} as const;

// =============================================================================
// UI Constants
// =============================================================================

export const CONVICTION_COLORS = {
  high: 'green',
  medium: 'yellow',
  low: 'gray',
} as const;

export const VALUATION_COLORS = {
  undervalued: 'green',
  fairly_valued: 'yellow',
  overvalued: 'red',
} as const;

export const STRATEGY_FIT_COLORS = {
  good_fit: 'green',
  partial_fit: 'yellow',
  poor_fit: 'red',
} as const;
