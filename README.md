# Thesis

> The investment research platform that remembers why you bought.

AI-powered stock analysis for position investors. Research stocks, document your thesis, and track whether your investment case still holds over time.

## Overview

Thesis is a hybrid investment platform combining:

- **AI Stock Reports** - Synthesized, plain-English stock analysis for every S&P 500 stock
- **Thesis Tracking** - Document why you bought, review if it still holds
- **Deterministic Personalization** - Strategy fit checks, portfolio impact calculations
- **Weekly Digest** - Portfolio performance, thesis reviews due, upcoming catalysts

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Monorepo** | pnpm + Turborepo |
| **Language** | TypeScript 5.7+ |
| **Backend** | Next.js 15 API Routes |
| **Frontend** | Next.js 15 (App Router) + React 19 |
| **Database** | PostgreSQL + Drizzle ORM |
| **Cache/Queue** | Redis + BullMQ |
| **UI** | shadcn/ui + Tailwind CSS 4 |
| **Auth** | Clerk |
| **AI** | OpenAI + Perplexity |

## Project Structure

```
thesis/
├── apps/
│   ├── web/                 # Next.js 15 frontend + API
│   └── jobs/                # Background job workers (BullMQ)
├── packages/
│   ├── db/                  # Drizzle schema + client
│   ├── data-providers/      # External API integrations
│   ├── ai/                  # AI report generation
│   └── shared/              # Shared types, utils, constants
├── docs/                    # Documentation
└── scripts/                 # CLI utilities
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL and Redis)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

| Service | Get API Key |
|---------|-------------|
| Clerk | [clerk.com](https://clerk.com/) |
| Alpha Vantage | [alphavantage.co](https://www.alphavantage.co/support/#api-key) |
| Financial Modeling Prep | [financialmodelingprep.com](https://financialmodelingprep.com/developer) |
| OpenAI | [platform.openai.com](https://platform.openai.com/) |
| Perplexity | [perplexity.ai](https://www.perplexity.ai/settings/api) |

### 4. Initialize Database

```bash
pnpm db:push
```

### 5. Start Development

```bash
pnpm dev
```

- Web app: http://localhost:3000
- Jobs worker: Runs in background

## Development

### Commands

```bash
# Development
pnpm dev              # Start all services
pnpm build            # Build all packages
pnpm lint             # Run linter
pnpm typecheck        # Run type checker
pnpm test             # Run tests

# Database
pnpm db:generate      # Generate Drizzle client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio
```

### Package Scripts

Each package can be run individually:

```bash
pnpm --filter @thesis/web dev
pnpm --filter @thesis/jobs dev
pnpm --filter @thesis/db studio
```

## Architecture

### Centralized vs Per-User Data

```
Centralized (per-stock):           Per-User:
├── AI Stock Reports               ├── Positions
├── Stock Data (quotes, fundamentals)  ├── Investment Theses
├── News Feed                      ├── Thesis Reviews
├── Analyst Estimates              ├── Strategy Profile
└── Catalyst Calendar              └── Portfolio Settings
```

### AI Report Generation Pipeline

```
Trigger (earnings, price move, weekly refresh)
    ↓
Job Queue (BullMQ)
    ↓
Data Collection (FMP, Alpha Vantage, News API)
    ↓
AI Synthesis (Perplexity for research, OpenAI for summarization)
    ↓
Quality Check (top 50 flagged for human review)
    ↓
Store in database
```

## License

Private - All rights reserved
