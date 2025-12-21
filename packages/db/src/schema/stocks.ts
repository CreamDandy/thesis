import {
  pgTable,
  text,
  varchar,
  timestamp,
  real,
  bigint,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// =============================================================================
// Stocks - Core security master data
// =============================================================================

export const stocks = pgTable(
  'stocks',
  {
    ticker: varchar('ticker', { length: 10 }).primaryKey(),
    name: text('name').notNull(),
    exchange: varchar('exchange', { length: 10 }),
    sector: varchar('sector', { length: 100 }),
    industry: varchar('industry', { length: 100 }),
    marketCap: bigint('market_cap', { mode: 'number' }),
    description: text('description'),
    employees: bigint('employees', { mode: 'number' }),
    website: text('website'),
    logoUrl: text('logo_url'),
    isActive: boolean('is_active').default(true).notNull(),
    isSP100: boolean('is_sp100').default(false).notNull(),
    isSP500: boolean('is_sp500').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('stocks_sector_idx').on(table.sector),
    index('stocks_is_sp100_idx').on(table.isSP100),
    index('stocks_is_sp500_idx').on(table.isSP500),
  ]
);

// =============================================================================
// Quotes - Price data (15-min delayed)
// =============================================================================

export const quotes = pgTable(
  'quotes',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    price: real('price').notNull(),
    open: real('open'),
    high: real('high'),
    low: real('low'),
    previousClose: real('previous_close'),
    change: real('change'),
    changePercent: real('change_percent'),
    volume: bigint('volume', { mode: 'number' }),
    avgVolume: bigint('avg_volume', { mode: 'number' }),
    week52High: real('week52_high'),
    week52Low: real('week52_low'),
    marketCap: bigint('market_cap', { mode: 'number' }),
    timestamp: timestamp('timestamp').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('quotes_ticker_idx').on(table.ticker),
    index('quotes_timestamp_idx').on(table.timestamp),
    uniqueIndex('quotes_ticker_timestamp_idx').on(table.ticker, table.timestamp),
  ]
);

// =============================================================================
// Fundamentals - Financial metrics
// =============================================================================

export const fundamentals = pgTable(
  'fundamentals',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    // Valuation
    pe: real('pe'),
    forwardPe: real('forward_pe'),
    ps: real('ps'),
    pb: real('pb'),
    evEbitda: real('ev_ebitda'),
    peg: real('peg'),
    enterpriseValue: bigint('enterprise_value', { mode: 'number' }),
    // Profitability
    grossMargin: real('gross_margin'),
    operatingMargin: real('operating_margin'),
    netMargin: real('net_margin'),
    roe: real('roe'),
    roa: real('roa'),
    roic: real('roic'),
    // Growth
    revenueGrowthYoY: real('revenue_growth_yoy'),
    epsGrowthYoY: real('eps_growth_yoy'),
    revenueGrowth3Y: real('revenue_growth_3y'),
    epsGrowth3Y: real('eps_growth_3y'),
    // Dividends
    dividendYield: real('dividend_yield'),
    payoutRatio: real('payout_ratio'),
    dividendGrowthYears: real('dividend_growth_years'),
    exDividendDate: timestamp('ex_dividend_date'),
    // Balance Sheet
    debtToEquity: real('debt_to_equity'),
    currentRatio: real('current_ratio'),
    quickRatio: real('quick_ratio'),
    totalDebt: bigint('total_debt', { mode: 'number' }),
    totalCash: bigint('total_cash', { mode: 'number' }),
    // Per Share
    eps: real('eps'),
    epsForward: real('eps_forward'),
    bookValue: real('book_value'),
    revenuePerShare: real('revenue_per_share'),
    fcfPerShare: real('fcf_per_share'),
    // Income Statement
    revenue: bigint('revenue', { mode: 'number' }),
    grossProfit: bigint('gross_profit', { mode: 'number' }),
    operatingIncome: bigint('operating_income', { mode: 'number' }),
    netIncome: bigint('net_income', { mode: 'number' }),
    ebitda: bigint('ebitda', { mode: 'number' }),
    // Cash Flow
    operatingCashFlow: bigint('operating_cash_flow', { mode: 'number' }),
    freeCashFlow: bigint('free_cash_flow', { mode: 'number' }),
    capitalExpenditure: bigint('capital_expenditure', { mode: 'number' }),
    // Shares
    sharesOutstanding: bigint('shares_outstanding', { mode: 'number' }),
    floatShares: bigint('float_shares', { mode: 'number' }),
    // Meta
    fiscalYearEnd: varchar('fiscal_year_end', { length: 20 }),
    asOfDate: timestamp('as_of_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('fundamentals_ticker_idx').on(table.ticker),
    uniqueIndex('fundamentals_ticker_date_idx').on(table.ticker, table.asOfDate),
  ]
);

// =============================================================================
// Analyst Estimates
// =============================================================================

export const analystEstimates = pgTable(
  'analyst_estimates',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    // Price Targets
    targetHigh: real('target_high'),
    targetLow: real('target_low'),
    targetMean: real('target_mean'),
    targetMedian: real('target_median'),
    numberOfAnalysts: real('number_of_analysts'),
    // Recommendations
    strongBuy: real('strong_buy'),
    buy: real('buy'),
    hold: real('hold'),
    sell: real('sell'),
    strongSell: real('strong_sell'),
    // EPS Estimates
    epsCurrentQtr: real('eps_current_qtr'),
    epsNextQtr: real('eps_next_qtr'),
    epsCurrentYear: real('eps_current_year'),
    epsNextYear: real('eps_next_year'),
    // Revenue Estimates
    revenueCurrentQtr: bigint('revenue_current_qtr', { mode: 'number' }),
    revenueNextQtr: bigint('revenue_next_qtr', { mode: 'number' }),
    revenueCurrentYear: bigint('revenue_current_year', { mode: 'number' }),
    revenueNextYear: bigint('revenue_next_year', { mode: 'number' }),
    // Meta
    asOfDate: timestamp('as_of_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('analyst_estimates_ticker_idx').on(table.ticker),
    uniqueIndex('analyst_estimates_ticker_date_idx').on(table.ticker, table.asOfDate),
  ]
);

// =============================================================================
// Catalysts - Upcoming events
// =============================================================================

export const catalysts = pgTable(
  'catalysts',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    eventType: varchar('event_type', { length: 50 }).notNull(), // earnings, dividend, product, regulatory, other
    title: text('title').notNull(),
    description: text('description'),
    eventDate: timestamp('event_date').notNull(),
    isConfirmed: boolean('is_confirmed').default(false).notNull(),
    source: text('source'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('catalysts_ticker_idx').on(table.ticker),
    index('catalysts_event_date_idx').on(table.eventDate),
    index('catalysts_event_type_idx').on(table.eventType),
  ]
);

// =============================================================================
// Stock News
// =============================================================================

export const stockNews = pgTable(
  'stock_news',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    summary: text('summary'),
    url: text('url').notNull(),
    source: varchar('source', { length: 100 }),
    author: varchar('author', { length: 200 }),
    imageUrl: text('image_url'),
    sentiment: varchar('sentiment', { length: 20 }), // positive, negative, neutral
    sentimentScore: real('sentiment_score'), // -1 to 1
    publishedAt: timestamp('published_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('stock_news_ticker_idx').on(table.ticker),
    index('stock_news_published_at_idx').on(table.publishedAt),
    uniqueIndex('stock_news_url_idx').on(table.url),
  ]
);

// Type exports
export type Stock = typeof stocks.$inferSelect;
export type NewStock = typeof stocks.$inferInsert;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type Fundamental = typeof fundamentals.$inferSelect;
export type NewFundamental = typeof fundamentals.$inferInsert;
export type AnalystEstimate = typeof analystEstimates.$inferSelect;
export type NewAnalystEstimate = typeof analystEstimates.$inferInsert;
export type Catalyst = typeof catalysts.$inferSelect;
export type NewCatalyst = typeof catalysts.$inferInsert;
export type StockNews = typeof stockNews.$inferSelect;
export type NewStockNews = typeof stockNews.$inferInsert;
