import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { QUEUES } from '../index.js';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export interface ReportGenerationJob {
  ticker: string;
  triggerType: 'earnings' | 'major_news' | 'price_move' | 'estimate_revision' | 'weekly_refresh' | 'manual';
  priority: number;
}

async function processReportGeneration(job: Job<ReportGenerationJob>) {
  const { ticker, triggerType } = job.data;
  
  console.log(`Generating report for ${ticker} (trigger: ${triggerType})`);
  
  try {
    // TODO: Implement actual report generation
    // 1. Fetch latest data from data providers
    // 2. Generate report using AI
    // 3. Store in database
    // 4. Update cache
    
    await job.updateProgress(10);
    console.log(`[${ticker}] Fetching market data...`);
    
    await job.updateProgress(30);
    console.log(`[${ticker}] Fetching fundamentals...`);
    
    await job.updateProgress(50);
    console.log(`[${ticker}] Generating AI report...`);
    
    await job.updateProgress(80);
    console.log(`[${ticker}] Storing report...`);
    
    await job.updateProgress(100);
    console.log(`[${ticker}] Report generation complete`);
    
    return {
      ticker,
      success: true,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Failed to generate report for ${ticker}:`, error);
    throw error;
  }
}

export const reportWorker = new Worker<ReportGenerationJob>(
  QUEUES.REPORT_GENERATION,
  processReportGeneration,
  {
    connection,
    concurrency: 2, // Process 2 reports at a time
    limiter: {
      max: 10,
      duration: 60000, // Max 10 reports per minute
    },
  }
);

reportWorker.on('completed', (job) => {
  console.log(`Report job ${job.id} completed for ${job.data.ticker}`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`Report job ${job?.id} failed:`, err.message);
});
