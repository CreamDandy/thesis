import {
  pgTable,
  text,
  varchar,
  timestamp,
  real,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { stocks } from './stocks.js';

// =============================================================================
// Users - User accounts (synced from Clerk)
// =============================================================================

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(), // Clerk user ID
    email: varchar('email', { length: 255 }).notNull(),
    name: text('name'),
    imageUrl: text('image_url'),
    
    // Subscription
    tier: varchar('tier', { length: 20 }).notNull().default('free'), // free, premium, pro
    stripeCustomerId: text('stripe_customer_id'),
    subscriptionId: text('subscription_id'),
    subscriptionStatus: varchar('subscription_status', { length: 20 }), // active, canceled, past_due
    
    // Usage tracking (for free tier limits)
    reportsViewedThisMonth: integer('reports_viewed_this_month').notNull().default(0),
    reportsViewedResetAt: timestamp('reports_viewed_reset_at'),
    
    // Preferences
    emailDigest: boolean('email_digest').default(true).notNull(),
    emailAlerts: boolean('email_alerts').default(true).notNull(),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastActiveAt: timestamp('last_active_at'),
  },
  (table) => [
    uniqueIndex('users_email_idx').on(table.email),
    index('users_tier_idx').on(table.tier),
  ]
);

// =============================================================================
// Strategy Profiles - User-defined investment strategies
// =============================================================================

export const strategyProfiles = pgTable(
  'strategy_profiles',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    // Strategy info
    name: varchar('name', { length: 100 }).notNull(),
    template: varchar('template', { length: 50 }).notNull(), // dividend_growth, quality_growth, deep_value, momentum, custom
    description: text('description'),
    isDefault: boolean('is_default').default(false).notNull(),
    
    // Criteria (stored as JSON for flexibility)
    criteria: jsonb('criteria').$type<{
      // Valuation
      maxPe?: number;
      maxPb?: number;
      maxPs?: number;
      maxEvEbitda?: number;
      // Profitability
      minRoe?: number;
      minRoic?: number;
      minMargin?: number;
      // Growth
      minRevenueGrowth?: number;
      minEpsGrowth?: number;
      // Dividends
      minYield?: number;
      maxPayoutRatio?: number;
      minDividendYears?: number;
      // Technical
      min52WeekPosition?: number;
      minRelativeStrength?: number;
      // Balance sheet
      maxDebtToEquity?: number;
      minCurrentRatio?: number;
      // Custom
      custom?: Record<string, unknown>;
    }>().notNull(),
    
    // Expected hold period
    typicalHoldPeriod: varchar('typical_hold_period', { length: 20 }), // 6mo, 1yr, 2yr, 5yr, indefinite
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('strategy_profiles_user_id_idx').on(table.userId),
    index('strategy_profiles_template_idx').on(table.template),
  ]
);

// =============================================================================
// Portfolios - User portfolios
// =============================================================================

export const portfolios = pgTable(
  'portfolios',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isDefault: boolean('is_default').default(false).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    
    // Cached totals (updated on position changes)
    totalValue: real('total_value'),
    totalCost: real('total_cost'),
    totalGain: real('total_gain'),
    totalGainPercent: real('total_gain_percent'),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('portfolios_user_id_idx').on(table.userId),
  ]
);

// =============================================================================
// Positions - User stock positions
// =============================================================================

export const positions = pgTable(
  'positions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    portfolioId: text('portfolio_id')
      .notNull()
      .references(() => portfolios.id, { onDelete: 'cascade' }),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker),
    
    // Position details
    shares: real('shares').notNull(),
    avgCost: real('avg_cost').notNull(),
    totalCost: real('total_cost').notNull(),
    entryDate: timestamp('entry_date').notNull(),
    
    // Optional planning fields
    targetPrice: real('target_price'),
    stopLoss: real('stop_loss'),
    expectedHold: varchar('expected_hold', { length: 20 }), // 6mo, 1yr, 2yr, 5yr, indefinite
    convictionLevel: varchar('conviction_level', { length: 10 }), // high, medium, low
    strategyTag: varchar('strategy_tag', { length: 50 }), // dividend_growth, quality_growth, etc.
    
    // Status
    status: varchar('status', { length: 20 }).notNull().default('open'), // open, closed
    closedAt: timestamp('closed_at'),
    closePrice: real('close_price'),
    closeReason: varchar('close_reason', { length: 50 }), // target_hit, stop_hit, thesis_invalid, manual
    
    // Cached current values (updated on quote sync)
    currentPrice: real('current_price'),
    currentValue: real('current_value'),
    unrealizedGain: real('unrealized_gain'),
    unrealizedGainPercent: real('unrealized_gain_percent'),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('positions_user_id_idx').on(table.userId),
    index('positions_portfolio_id_idx').on(table.portfolioId),
    index('positions_ticker_idx').on(table.ticker),
    index('positions_status_idx').on(table.status),
  ]
);

// =============================================================================
// Theses - Investment theses for positions
// =============================================================================

export const theses = pgTable(
  'theses',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    positionId: text('position_id')
      .notNull()
      .references(() => positions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    version: integer('version').notNull().default(1),
    
    // Core thesis content
    content: text('content').notNull(),
    
    // Structured prompts (optional)
    whyNow: text('why_now'),
    competitiveAdvantage: text('competitive_advantage'),
    keyRisks: text('key_risks'),
    sellConditions: text('sell_conditions'),
    portfolioFit: text('portfolio_fit'),
    
    // Catalysts
    catalysts: jsonb('catalysts').$type<{
      description: string;
      expectedDate?: string;
    }[]>(),
    
    // Status
    isActive: boolean('is_active').default(true).notNull(),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('theses_position_id_idx').on(table.positionId),
    index('theses_user_id_idx').on(table.userId),
    index('theses_is_active_idx').on(table.isActive),
    uniqueIndex('theses_position_version_idx').on(table.positionId, table.version),
  ]
);

// =============================================================================
// Thesis Reviews - Review history for theses
// =============================================================================

export const thesisReviews = pgTable(
  'thesis_reviews',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    thesisId: text('thesis_id')
      .notNull()
      .references(() => theses.id, { onDelete: 'cascade' }),
    positionId: text('position_id')
      .notNull()
      .references(() => positions.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    // Review details
    action: varchar('action', { length: 20 }).notNull(), // reaffirm, update, close
    notes: text('notes'),
    
    // Trigger info
    trigger: varchar('trigger', { length: 50 }).notNull(), // price_drop_20, earnings, catalyst_passed, staleness_6mo, manual
    triggerData: jsonb('trigger_data'),
    
    // For close action
    exitReflection: text('exit_reflection'),
    
    // Snapshot at review time
    priceAtReview: real('price_at_review'),
    gainAtReview: real('gain_at_review'),
    gainPercentAtReview: real('gain_percent_at_review'),
    
    // Timestamps
    reviewedAt: timestamp('reviewed_at').defaultNow().notNull(),
  },
  (table) => [
    index('thesis_reviews_thesis_id_idx').on(table.thesisId),
    index('thesis_reviews_position_id_idx').on(table.positionId),
    index('thesis_reviews_user_id_idx').on(table.userId),
    index('thesis_reviews_reviewed_at_idx').on(table.reviewedAt),
  ]
);

// =============================================================================
// Watchlists - User watchlists
// =============================================================================

export const watchlists = pgTable(
  'watchlists',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    isDefault: boolean('is_default').default(false).notNull(),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('watchlists_user_id_idx').on(table.userId),
  ]
);

export const watchlistItems = pgTable(
  'watchlist_items',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    watchlistId: text('watchlist_id')
      .notNull()
      .references(() => watchlists.id, { onDelete: 'cascade' }),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker),
    
    notes: text('notes'),
    targetPrice: real('target_price'),
    alertOnPrice: real('alert_on_price'),
    
    // Timestamps
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (table) => [
    index('watchlist_items_watchlist_id_idx').on(table.watchlistId),
    index('watchlist_items_ticker_idx').on(table.ticker),
    uniqueIndex('watchlist_items_watchlist_ticker_idx').on(table.watchlistId, table.ticker),
  ]
);

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type StrategyProfile = typeof strategyProfiles.$inferSelect;
export type NewStrategyProfile = typeof strategyProfiles.$inferInsert;
export type Portfolio = typeof portfolios.$inferSelect;
export type NewPortfolio = typeof portfolios.$inferInsert;
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
export type Thesis = typeof theses.$inferSelect;
export type NewThesis = typeof theses.$inferInsert;
export type ThesisReview = typeof thesisReviews.$inferSelect;
export type NewThesisReview = typeof thesisReviews.$inferInsert;
export type Watchlist = typeof watchlists.$inferSelect;
export type NewWatchlist = typeof watchlists.$inferInsert;
export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type NewWatchlistItem = typeof watchlistItems.$inferInsert;
