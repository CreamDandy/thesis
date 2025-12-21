import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Import and re-export schema tables
import {
  stocks,
  quotes,
  fundamentals,
  analystEstimates,
  catalysts,
  stockNews,
  stockReports,
  reportFeedback,
  reportQueue,
  users,
  strategyProfiles,
  portfolios,
  positions,
  theses,
  thesisReviews,
  watchlists,
  watchlistItems,
} from '@thesis/db';

export {
  stocks,
  quotes,
  fundamentals,
  analystEstimates,
  catalysts,
  stockNews,
  stockReports,
  reportFeedback,
  reportQueue,
  users,
  strategyProfiles,
  portfolios,
  positions,
  theses,
  thesisReviews,
  watchlists,
  watchlistItems,
};

// Import schema for drizzle
import * as schema from '@thesis/db';

// Lazy database client - only connects when actually used
// This prevents build-time errors when DATABASE_URL is not set
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

export function getDatabase() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

// For convenience, export a proxy that lazily initializes the db
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return getDatabase()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
  },
});
