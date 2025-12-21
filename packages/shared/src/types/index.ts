import { z } from 'zod';

// =============================================================================
// Stock & Market Data Types
// =============================================================================

export const StockSchema = z.object({
  ticker: z.string().min(1).max(10),
  name: z.string(),
  exchange: z.enum(['NYSE', 'NASDAQ', 'AMEX']).optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  marketCap: z.number().optional(),
  description: z.string().optional(),
});

export type Stock = z.infer<typeof StockSchema>;

export const QuoteSchema = z.object({
  ticker: z.string(),
  price: z.number(),
  open: z.number().optional(),
  high: z.number().optional(),
  low: z.number().optional(),
  close: z.number().optional(),
  volume: z.number().optional(),
  change: z.number().optional(),
  changePercent: z.number().optional(),
  timestamp: z.date(),
});

export type Quote = z.infer<typeof QuoteSchema>;

export const FundamentalsSchema = z.object({
  ticker: z.string(),
  // Valuation
  pe: z.number().nullable(),
  forwardPe: z.number().nullable(),
  ps: z.number().nullable(),
  pb: z.number().nullable(),
  evEbitda: z.number().nullable(),
  peg: z.number().nullable(),
  // Profitability
  grossMargin: z.number().nullable(),
  operatingMargin: z.number().nullable(),
  netMargin: z.number().nullable(),
  roe: z.number().nullable(),
  roa: z.number().nullable(),
  roic: z.number().nullable(),
  // Growth
  revenueGrowthYoY: z.number().nullable(),
  epsGrowthYoY: z.number().nullable(),
  // Dividends
  dividendYield: z.number().nullable(),
  payoutRatio: z.number().nullable(),
  dividendGrowthYears: z.number().nullable(),
  // Balance Sheet
  debtToEquity: z.number().nullable(),
  currentRatio: z.number().nullable(),
  quickRatio: z.number().nullable(),
  // Per Share
  eps: z.number().nullable(),
  bookValue: z.number().nullable(),
  fcfPerShare: z.number().nullable(),
  // Meta
  asOfDate: z.date(),
});

export type Fundamentals = z.infer<typeof FundamentalsSchema>;

// =============================================================================
// AI Stock Report Types
// =============================================================================

export const ReportSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  confidence: z.number().min(0).max(1).optional(),
});

export type ReportSection = z.infer<typeof ReportSectionSchema>;

export const StockReportSchema = z.object({
  ticker: z.string(),
  version: z.number(),
  generatedAt: z.date(),
  // Core sections
  executiveSummary: z.string(),
  bullCase: z.array(z.string()),
  bearCase: z.array(z.string()),
  valuationAssessment: z.string(),
  valuationVerdict: z.enum(['undervalued', 'fairly_valued', 'overvalued']),
  keyMetrics: z.array(z.object({
    name: z.string(),
    value: z.string(),
    explanation: z.string(),
  })),
  recentDevelopments: z.array(z.object({
    date: z.date(),
    headline: z.string(),
    summary: z.string(),
  })),
  catalystCalendar: z.array(z.object({
    date: z.date(),
    event: z.string(),
    type: z.enum(['earnings', 'dividend', 'product', 'regulatory', 'other']),
  })),
  // Metadata
  sources: z.array(z.string()).optional(),
  modelUsed: z.string().optional(),
  qualityScore: z.number().min(0).max(100).optional(),
  humanReviewed: z.boolean().default(false),
});

export type StockReport = z.infer<typeof StockReportSchema>;

export type ReportUpdateTrigger = 
  | 'earnings'
  | 'major_news'
  | 'price_move'
  | 'estimate_revision'
  | 'weekly_refresh'
  | 'manual';

// =============================================================================
// User & Portfolio Types
// =============================================================================

export const StrategyTemplateSchema = z.enum([
  'dividend_growth',
  'quality_growth',
  'deep_value',
  'momentum',
  'custom',
]);

export type StrategyTemplate = z.infer<typeof StrategyTemplateSchema>;

export const StrategyCriteriaSchema = z.object({
  template: StrategyTemplateSchema,
  // Valuation criteria
  maxPe: z.number().optional(),
  maxPb: z.number().optional(),
  maxPs: z.number().optional(),
  // Profitability criteria
  minRoe: z.number().optional(),
  minRoic: z.number().optional(),
  minMargin: z.number().optional(),
  // Growth criteria
  minRevenueGrowth: z.number().optional(),
  minEpsGrowth: z.number().optional(),
  // Dividend criteria
  minYield: z.number().optional(),
  maxPayoutRatio: z.number().optional(),
  minDividendYears: z.number().optional(),
  // Technical criteria
  min52WeekPosition: z.number().optional(), // 0-100, how close to 52w high
  minRelativeStrength: z.number().optional(),
  // Custom criteria
  customCriteria: z.record(z.unknown()).optional(),
});

export type StrategyCriteria = z.infer<typeof StrategyCriteriaSchema>;

export const ConvictionLevelSchema = z.enum(['high', 'medium', 'low']);
export type ConvictionLevel = z.infer<typeof ConvictionLevelSchema>;

export const HoldPeriodSchema = z.enum(['6mo', '1yr', '2yr', '5yr', 'indefinite']);
export type HoldPeriod = z.infer<typeof HoldPeriodSchema>;

export const PositionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  ticker: z.string(),
  shares: z.number().positive(),
  avgCost: z.number().positive(),
  entryDate: z.date(),
  // Optional fields
  targetPrice: z.number().positive().optional(),
  stopLoss: z.number().positive().optional(),
  expectedHold: HoldPeriodSchema.optional(),
  convictionLevel: ConvictionLevelSchema.optional(),
  strategyTag: StrategyTemplateSchema.optional(),
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
  closedAt: z.date().optional(),
  closePrice: z.number().optional(),
});

export type Position = z.infer<typeof PositionSchema>;

export const ThesisSchema = z.object({
  id: z.string(),
  positionId: z.string(),
  version: z.number(),
  // Core thesis content
  content: z.string().min(1),
  // Structured prompts (optional)
  whyNow: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  keyRisks: z.string().optional(),
  sellConditions: z.string().optional(),
  portfolioFit: z.string().optional(),
  // Catalysts
  catalysts: z.array(z.object({
    description: z.string(),
    expectedDate: z.date().optional(),
  })).optional(),
  // Timestamps
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Thesis = z.infer<typeof ThesisSchema>;

export const ThesisReviewSchema = z.object({
  id: z.string(),
  thesisId: z.string(),
  positionId: z.string(),
  // Review details
  action: z.enum(['reaffirm', 'update', 'close']),
  notes: z.string().optional(),
  // Trigger info
  trigger: z.enum([
    'price_drop_20',
    'earnings',
    'catalyst_passed',
    'staleness_6mo',
    'manual',
  ]),
  // For close action
  exitReflection: z.string().optional(),
  // Timestamps
  reviewedAt: z.date(),
});

export type ThesisReview = z.infer<typeof ThesisReviewSchema>;

// =============================================================================
// Portfolio Analytics Types
// =============================================================================

export const PortfolioImpactSchema = z.object({
  // Before/after metrics
  sectorConcentration: z.object({
    before: z.record(z.number()),
    after: z.record(z.number()),
    warning: z.boolean(),
  }),
  correlation: z.number(), // With existing holdings
  betaImpact: z.object({
    before: z.number(),
    after: z.number(),
  }),
  dividendYieldImpact: z.object({
    before: z.number(),
    after: z.number(),
  }),
});

export type PortfolioImpact = z.infer<typeof PortfolioImpactSchema>;

export const StrategyFitSchema = z.object({
  ticker: z.string(),
  strategyName: z.string(),
  criteria: z.array(z.object({
    name: z.string(),
    required: z.string(),
    actual: z.string(),
    passed: z.boolean(),
  })),
  matchScore: z.number(), // 0-100
  verdict: z.enum(['good_fit', 'partial_fit', 'poor_fit']),
});

export type StrategyFit = z.infer<typeof StrategyFitSchema>;

// =============================================================================
// API Response Types
// =============================================================================

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).optional(),
    meta: z.object({
      timestamp: z.date(),
      requestId: z.string().optional(),
    }).optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: Date;
    requestId?: string;
  };
};

// =============================================================================
// Pagination Types
// =============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  });

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};
