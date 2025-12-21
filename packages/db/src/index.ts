import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

// Re-export schema
export * from './schema/index.js';

// Database client singleton
let db: ReturnType<typeof createDb> | null = null;

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

/**
 * Get the database client instance.
 * Creates a new connection if one doesn't exist.
 */
export function getDb() {
  if (!db) {
    db = createDb();
  }
  return db;
}

/**
 * Create a new database client with custom options.
 * Useful for testing or specific connection requirements.
 */
export function createDbClient(connectionString: string) {
  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  return drizzle(client, { schema });
}

// Export types
export type Database = ReturnType<typeof getDb>;
