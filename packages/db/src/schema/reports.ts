import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { stocks } from './stocks.js';

// =============================================================================
// Stock Reports - AI-generated analysis (centralized, per-stock)
// =============================================================================

export const stockReports = pgTable(
  'stock_reports',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    version: integer('version').notNull().default(1),
    
    // Core content
    executiveSummary: text('executive_summary').notNull(),
    bullCase: jsonb('bull_case').$type<string[]>().notNull(),
    bearCase: jsonb('bear_case').$type<string[]>().notNull(),
    valuationAssessment: text('valuation_assessment').notNull(),
    valuationVerdict: varchar('valuation_verdict', { length: 20 }).notNull(), // undervalued, fairly_valued, overvalued
    
    // Structured data
    keyMetrics: jsonb('key_metrics').$type<{
      name: string;
      value: string;
      explanation: string;
    }[]>().notNull(),
    recentDevelopments: jsonb('recent_developments').$type<{
      date: string;
      headline: string;
      summary: string;
    }[]>(),
    catalystCalendar: jsonb('catalyst_calendar').$type<{
      date: string;
      event: string;
      type: 'earnings' | 'dividend' | 'product' | 'regulatory' | 'other';
    }[]>(),
    
    // Quality & metadata
    qualityScore: integer('quality_score'), // 0-100
    confidenceScore: integer('confidence_score'), // 0-100
    humanReviewed: boolean('human_reviewed').default(false).notNull(),
    reviewedBy: text('reviewed_by'),
    reviewedAt: timestamp('reviewed_at'),
    
    // Generation metadata
    modelUsed: varchar('model_used', { length: 50 }),
    promptVersion: varchar('prompt_version', { length: 20 }),
    sources: jsonb('sources').$type<string[]>(),
    generationTimeMs: integer('generation_time_ms'),
    
    // Trigger info
    triggerType: varchar('trigger_type', { length: 50 }), // earnings, major_news, price_move, estimate_revision, weekly_refresh, manual
    triggerData: jsonb('trigger_data'),
    
    // Timestamps
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('stock_reports_ticker_idx').on(table.ticker),
    index('stock_reports_generated_at_idx').on(table.generatedAt),
    index('stock_reports_human_reviewed_idx').on(table.humanReviewed),
    uniqueIndex('stock_reports_ticker_version_idx').on(table.ticker, table.version),
  ]
);

// =============================================================================
// Report Feedback - User feedback on reports
// =============================================================================

export const reportFeedback = pgTable(
  'report_feedback',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    reportId: text('report_id')
      .notNull()
      .references(() => stockReports.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    
    // Feedback
    rating: varchar('rating', { length: 10 }).notNull(), // thumbs_up, thumbs_down
    feedbackType: varchar('feedback_type', { length: 50 }), // inaccurate, outdated, unclear, helpful, insightful
    comment: text('comment'),
    
    // Timestamps
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('report_feedback_report_id_idx').on(table.reportId),
    index('report_feedback_user_id_idx').on(table.userId),
    uniqueIndex('report_feedback_report_user_idx').on(table.reportId, table.userId),
  ]
);

// =============================================================================
// Report Generation Queue - Track report generation jobs
// =============================================================================

export const reportQueue = pgTable(
  'report_queue',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    ticker: varchar('ticker', { length: 10 })
      .notNull()
      .references(() => stocks.ticker, { onDelete: 'cascade' }),
    
    // Job info
    priority: integer('priority').notNull().default(5), // 1 = highest, 10 = lowest
    triggerType: varchar('trigger_type', { length: 50 }).notNull(),
    triggerData: jsonb('trigger_data'),
    
    // Status
    status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, processing, completed, failed
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    lastError: text('last_error'),
    
    // Result
    reportId: text('report_id').references(() => stockReports.id),
    
    // Timestamps
    scheduledFor: timestamp('scheduled_for').defaultNow().notNull(),
    startedAt: timestamp('started_at'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    index('report_queue_ticker_idx').on(table.ticker),
    index('report_queue_status_idx').on(table.status),
    index('report_queue_priority_idx').on(table.priority),
    index('report_queue_scheduled_for_idx').on(table.scheduledFor),
  ]
);

// Type exports
export type StockReport = typeof stockReports.$inferSelect;
export type NewStockReport = typeof stockReports.$inferInsert;
export type ReportFeedback = typeof reportFeedback.$inferSelect;
export type NewReportFeedback = typeof reportFeedback.$inferInsert;
export type ReportQueueItem = typeof reportQueue.$inferSelect;
export type NewReportQueueItem = typeof reportQueue.$inferInsert;
