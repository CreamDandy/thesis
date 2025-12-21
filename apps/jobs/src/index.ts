import 'dotenv/config';
import { Worker, Queue } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection
const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

// Queue names
export const QUEUES = {
  REPORT_GENERATION: 'report-generation',
  QUOTE_SYNC: 'quote-sync',
  NEWS_CRAWL: 'news-crawl',
  DIGEST_SEND: 'digest-send',
} as const;

// Create queues
export const reportQueue = new Queue(QUEUES.REPORT_GENERATION, { connection });
export const quoteQueue = new Queue(QUEUES.QUOTE_SYNC, { connection });
export const newsQueue = new Queue(QUEUES.NEWS_CRAWL, { connection });
export const digestQueue = new Queue(QUEUES.DIGEST_SEND, { connection });

// Import workers
import { reportWorker } from './workers/report-generator.js';
import { quoteWorker } from './workers/quote-sync.js';

// Start workers
console.log('Starting job workers...');

const workers: Worker[] = [
  reportWorker,
  quoteWorker,
];

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
});

console.log('Job workers started successfully');
