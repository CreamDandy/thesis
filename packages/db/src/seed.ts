import { getDb } from './index.js';
import { stocks } from './schema/stocks.js';
import { SP100_TICKERS, GICS_SECTORS } from '@thesis/shared';
import { STOCK_NAMES } from './seed-data.js';

// =============================================================================
// Configuration
// =============================================================================

interface SeedOptions {
  clearExisting?: boolean;
  verbose?: boolean;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get sector for a given ticker from GICS_SECTORS mapping
 */
function getSectorForTicker(ticker: string): string | null {
  for (const [sector, tickers] of Object.entries(GICS_SECTORS)) {
    if ((tickers as readonly string[]).includes(ticker)) {
      return sector;
    }
  }
  return null;
}

/**
 * Log with timestamp
 */
function log(message: string, verbose = true) {
  if (verbose) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// =============================================================================
// Seed Function
// =============================================================================

/**
 * Seeds the database with S&P 100 stocks
 */
export async function seedStocks(options: SeedOptions = {}) {
  const { clearExisting = false, verbose = true } = options;
  const db = getDb();

  log('Starting S&P 100 stock seeding...', verbose);

  try {
    // Clear existing stocks if requested
    if (clearExisting) {
      log('Clearing existing stocks...', verbose);
      await db.delete(stocks);
      log('Existing stocks cleared.', verbose);
    }

    // Prepare stock data
    const stockData = SP100_TICKERS.map((ticker) => ({
      ticker,
      name: STOCK_NAMES[ticker] || ticker,
      sector: getSectorForTicker(ticker),
      isSP100: true,
      isActive: true,
      isSP500: true, // All S&P 100 stocks are also in S&P 500
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    log(`Prepared ${stockData.length} stocks for insertion.`, verbose);

    // Insert stocks with conflict handling
    let inserted = 0;

    // Use transaction for atomicity
    await db.transaction(async (tx) => {
      for (const stock of stockData) {
        const result = await tx
          .insert(stocks)
          .values(stock)
          .onConflictDoUpdate({
            target: stocks.ticker,
            set: {
              name: stock.name,
              sector: stock.sector,
              isSP100: stock.isSP100,
              isSP500: stock.isSP500,
              isActive: stock.isActive,
              updatedAt: new Date(),
            },
          })
          .returning({ ticker: stocks.ticker });

        if (result.length > 0) {
          // Check if this was an insert or update by querying
          // For simplicity, we count all as processed
          inserted++;
        }

        if (verbose && inserted % 20 === 0) {
          log(`Progress: ${inserted}/${stockData.length} stocks processed.`, verbose);
        }
      }
    });

    log(`Seeding complete! Processed ${inserted} stocks.`, verbose);

    // Log sector distribution
    if (verbose) {
      log('Sector distribution:', verbose);
      const sectorCounts: Record<string, number> = {};
      for (const stock of stockData) {
        const sector = stock.sector || 'Unknown';
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      }
      for (const [sector, count] of Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])) {
        log(`  ${sector}: ${count}`, verbose);
      }
    }

    return { success: true, count: inserted };
  } catch (error) {
    log(`Error during seeding: ${error}`, true);
    throw error;
  }
}

// =============================================================================
// Main Execution
// =============================================================================

async function main() {
  const args = process.argv.slice(2);
  const clearExisting = args.includes('--clear') || args.includes('-c');
  const quiet = args.includes('--quiet') || args.includes('-q');

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: tsx src/seed.ts [options]

Options:
  -c, --clear   Clear existing stocks before seeding
  -q, --quiet   Suppress verbose output
  -h, --help    Show this help message
`);
    process.exit(0);
  }

  try {
    await seedStocks({
      clearExisting,
      verbose: !quiet,
    });
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

main();
