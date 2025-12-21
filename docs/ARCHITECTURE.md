# Thesis Architecture

## Overview

Thesis is built as a TypeScript monorepo with clear separation between:

1. **Centralized content** - AI stock reports, market data (same for all users)
2. **Per-user content** - Positions, theses, portfolios (personalized)
3. **Deterministic personalization** - Strategy fit, portfolio impact (rules-based, not AI)

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                        │
│                         Next.js 15 (App Router)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pages:                                                                      │
│  - / (Landing)                                                               │
│  - /stocks (Screener)                                                        │
│  - /stocks/[ticker] (Stock Detail + AI Report)                              │
│  - /dashboard (Portfolio Overview)                                           │
│  - /journal (Investment Journal)                                             │
│  - /settings (User Preferences)                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│                      Next.js API Routes (/api/*)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Endpoints:                                                                  │
│  - /api/stocks - Stock data, quotes, fundamentals                           │
│  - /api/reports - AI stock reports                                          │
│  - /api/positions - User positions CRUD                                     │
│  - /api/theses - Investment theses CRUD                                     │
│  - /api/portfolios - Portfolio management                                   │
│  - /api/webhooks - Clerk webhooks, Stripe webhooks                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│     PostgreSQL       │ │      Redis       │ │    Job Workers       │
│   (Drizzle ORM)      │ │   (Cache/Queue)  │ │     (BullMQ)         │
├──────────────────────┤ ├──────────────────┤ ├──────────────────────┤
│ - Users              │ │ - Session cache  │ │ - Report generation  │
│ - Stocks             │ │ - Quote cache    │ │ - Quote sync         │
│ - Reports            │ │ - Job queues     │ │ - News crawl         │
│ - Positions          │ │                  │ │ - Digest send        │
│ - Theses             │ │                  │ │                      │
│ - Portfolios         │ │                  │ │                      │
└──────────────────────┘ └──────────────────┘ └──────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Data Providers:                    AI Providers:                            │
│  - Alpha Vantage (quotes)           - OpenAI (report synthesis)              │
│  - FMP (fundamentals)               - Perplexity (research)                  │
│  - NewsAPI (news)                                                            │
│                                                                              │
│  Auth & Payments:                                                            │
│  - Clerk (authentication)                                                    │
│  - Stripe (subscriptions)                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Package Structure

### @thesis/shared

Shared types, utilities, and constants used across all packages.

```typescript
// Types
export type Stock, Quote, Fundamentals, StockReport, Position, Thesis, ...

// Constants
export const SP100_TICKERS, GICS_SECTORS, STRATEGY_TEMPLATES, ...

// Utils
export function formatCurrency, formatPercent, calculatePositionSize, ...
```

### @thesis/db

Drizzle ORM schema and database client.

```typescript
// Schema
export const stocks, quotes, fundamentals, stockReports, users, positions, theses, ...

// Client
export function getDb(): Database
```

### @thesis/data-providers

External API integrations with rate limiting.

```typescript
// Clients
export class AlphaVantageClient { getQuote, getOverview, ... }
export class FMPClient { getQuote, getProfile, getFundamentals, ... }
export class NewsAPIClient { search, getStockNews, ... }
```

### @thesis/ai

AI report generation with quality scoring.

```typescript
// Report Generator
export class ReportGenerator {
  generateReport(input: StockReportInput): Promise<GeneratedReport>
  researchStock(ticker: string): Promise<string>
}

// Quality Scoring
export function scoreReportQuality(report: GeneratedReport): QualityScore
```

### @thesis/web

Next.js 15 application with App Router.

```
src/
├── app/                    # App Router pages
│   ├── (auth)/             # Auth pages
│   ├── (dashboard)/        # Protected routes
│   ├── stocks/             # Public stock pages
│   └── api/                # API routes
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utilities
└── hooks/                  # Custom hooks
```

### @thesis/jobs

Background job workers using BullMQ.

```typescript
// Workers
export const reportWorker   // Generate AI reports
export const quoteWorker    // Sync stock quotes
export const newsWorker     // Crawl news
export const digestWorker   // Send weekly digests
```

## Data Flow

### AI Report Generation

```
1. Trigger detected (earnings, price move, weekly refresh)
   ↓
2. Job added to report-generation queue
   ↓
3. Worker picks up job
   ↓
4. Fetch data from providers (FMP, Alpha Vantage)
   ↓
5. Research with Perplexity (optional)
   ↓
6. Generate report with OpenAI
   ↓
7. Score quality
   ↓
8. Store in database
   ↓
9. Invalidate cache
```

### User Position Flow

```
1. User adds position
   ↓
2. Prompt for thesis (optional but encouraged)
   ↓
3. Store position + thesis
   ↓
4. Calculate portfolio impact
   ↓
5. Set up thesis review triggers
   ↓
6. Monitor for review conditions
   ↓
7. Prompt user when review needed
```

## Security

- **Authentication**: Clerk handles all auth
- **Authorization**: Row-level security via user ID checks
- **API Keys**: Stored in environment variables, never exposed to client
- **Rate Limiting**: Applied at data provider level
- **Input Validation**: Zod schemas for all inputs

## Scaling Considerations

1. **Reports are centralized**: Same report for all users = O(stocks) not O(users × stocks)
2. **Aggressive caching**: Redis for quotes, reports, session data
3. **Job queues**: Background processing for expensive operations
4. **Database indexes**: Optimized for common query patterns
5. **Edge caching**: Static pages cached at CDN level
