import { z } from 'zod';
import { HttpClient, RateLimitConfig } from '../utils/http.js';
import { RATE_LIMITS } from '@thesis/shared';

// =============================================================================
// NewsAPI Response Schemas
// =============================================================================

const NewsArticleSchema = z.object({
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

const NewsResponseSchema = z.object({
  status: z.string(),
  totalResults: z.number(),
  articles: z.array(NewsArticleSchema),
});

// =============================================================================
// Parsed Types
// =============================================================================

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  source: string;
  author: string | null;
  publishedAt: Date;
  content: string | null;
}

export interface NewsSearchOptions {
  query: string;
  from?: Date;
  to?: Date;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
  pageSize?: number;
  page?: number;
}

// =============================================================================
// NewsAPI Client
// =============================================================================

export class NewsAPIClient {
  private readonly client: HttpClient;

  constructor(apiKey: string, rateLimitConfig?: RateLimitConfig) {
    this.client = new HttpClient({
      baseUrl: 'https://newsapi.org/v2',
      headers: {
        'X-Api-Key': apiKey,
      },
    });
    this.client.setRateLimiter(rateLimitConfig ?? {
      requestsPerMinute: 10,
      requestsPerDay: RATE_LIMITS.newsApi.requestsPerDay,
    });
  }

  /**
   * Search for news articles
   */
  async search(options: NewsSearchOptions): Promise<NewsArticle[]> {
    const params: Record<string, string | number> = {
      q: options.query,
      sortBy: options.sortBy ?? 'publishedAt',
      pageSize: options.pageSize ?? 20,
      page: options.page ?? 1,
      language: 'en',
    };

    if (options.from) {
      params.from = options.from.toISOString().split('T')[0]!;
    }
    if (options.to) {
      params.to = options.to.toISOString().split('T')[0]!;
    }

    const response = await this.client.get<unknown>('/everything', params);
    const parsed = NewsResponseSchema.parse(response);

    return parsed.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      author: article.author,
      publishedAt: new Date(article.publishedAt),
      content: article.content,
    }));
  }

  /**
   * Get news for a specific stock ticker
   */
  async getStockNews(ticker: string, options?: Partial<NewsSearchOptions>): Promise<NewsArticle[]> {
    // Search for company name and ticker
    const query = `"${ticker}" OR "${ticker} stock"`;
    
    return this.search({
      query,
      sortBy: 'publishedAt',
      pageSize: 10,
      ...options,
    });
  }

  /**
   * Get top business headlines
   */
  async getTopHeadlines(options?: { pageSize?: number; page?: number }): Promise<NewsArticle[]> {
    const params: Record<string, string | number> = {
      category: 'business',
      country: 'us',
      pageSize: options?.pageSize ?? 20,
      page: options?.page ?? 1,
    };

    const response = await this.client.get<unknown>('/top-headlines', params);
    const parsed = NewsResponseSchema.parse(response);

    return parsed.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
      author: article.author,
      publishedAt: new Date(article.publishedAt),
      content: article.content,
    }));
  }
}

// =============================================================================
// Simple Sentiment Analysis
// =============================================================================

const POSITIVE_WORDS = [
  'surge', 'soar', 'jump', 'gain', 'rise', 'rally', 'boost', 'growth',
  'profit', 'beat', 'exceed', 'strong', 'bullish', 'upgrade', 'buy',
  'outperform', 'record', 'high', 'success', 'positive', 'optimistic',
];

const NEGATIVE_WORDS = [
  'drop', 'fall', 'plunge', 'decline', 'loss', 'miss', 'weak', 'bearish',
  'downgrade', 'sell', 'underperform', 'low', 'fail', 'negative', 'concern',
  'risk', 'warning', 'cut', 'slash', 'layoff', 'recession', 'crash',
];

/**
 * Simple sentiment analysis based on keyword matching
 * Returns a score between -1 (very negative) and 1 (very positive)
 */
export function analyzeSentiment(text: string): { score: number; sentiment: 'positive' | 'negative' | 'neutral' } {
  const lowerText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;

  for (const word of POSITIVE_WORDS) {
    if (lowerText.includes(word)) positiveCount++;
  }

  for (const word of NEGATIVE_WORDS) {
    if (lowerText.includes(word)) negativeCount++;
  }

  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { score: 0, sentiment: 'neutral' };
  }

  const score = (positiveCount - negativeCount) / total;
  
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (score > 0.2) {
    sentiment = 'positive';
  } else if (score < -0.2) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }

  return { score, sentiment };
}
