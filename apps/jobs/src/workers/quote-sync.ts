import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUES } from '../index.js';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export interface QuoteSyncJob {
  tickers: string[];
  batchId: string;
}

async function processQuoteSync(job: Job<QuoteSyncJob>) {
  const { tickers, batchId } = job.data;
  
  console.log(`Syncing quotes for ${tickers.length} tickers (batch: ${batchId})`);
  
  try {
    // TODO: Implement actual quote sync
    // 1. Fetch quotes from data provider
    // 2. Update database
    // 3. Update position values
    // 4. Check for price alerts
    
    const results = {
      synced: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    for (let i = 0; i < tickers.length; i++) {
      const ticker = tickers[i];
      try {
        // Simulate quote fetch
        await new Promise((resolve) => setTimeout(resolve, 100));
        results.synced++;
        
        await job.updateProgress(Math.round(((i + 1) / tickers.length) * 100));
      } catch (error) {
        results.failed++;
        results.errors.push(`${ticker}: ${error}`);
      }
    }
    
    console.log(`Quote sync complete: ${results.synced} synced, ${results.failed} failed`);
    
    return results;
  } catch (error) {
    console.error(`Quote sync failed for batch ${batchId}:`, error);
    throw error;
  }
}

export const quoteWorker = new Worker<QuoteSyncJob>(
  QUEUES.QUOTE_SYNC,
  processQuoteSync,
  {
    connection,
    concurrency: 1, // Process one batch at a time
    limiter: {
      max: 5,
      duration: 60000, // Max 5 batches per minute
    },
  }
);

quoteWorker.on('completed', (job) => {
  console.log(`Quote sync job ${job.id} completed`);
});

quoteWorker.on('failed', (job, err) => {
  console.error(`Quote sync job ${job?.id} failed:`, err.message);
});
