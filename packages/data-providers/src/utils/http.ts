import { sleep } from '@thesis/shared';

export interface HttpClientOptions {
  baseUrl: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay?: number;
}

/**
 * Simple rate limiter using token bucket algorithm
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per ms
  private dailyCount: number = 0;
  private dailyReset: number = Date.now();
  private readonly dailyLimit?: number;

  constructor(config: RateLimitConfig) {
    this.maxTokens = config.requestsPerMinute;
    this.tokens = this.maxTokens;
    this.refillRate = config.requestsPerMinute / 60000; // per ms
    this.lastRefill = Date.now();
    this.dailyLimit = config.requestsPerDay;
  }

  async acquire(): Promise<void> {
    // Check daily limit
    if (this.dailyLimit) {
      const now = Date.now();
      // Reset daily count at midnight
      if (now - this.dailyReset > 24 * 60 * 60 * 1000) {
        this.dailyCount = 0;
        this.dailyReset = now;
      }
      if (this.dailyCount >= this.dailyLimit) {
        throw new Error('Daily rate limit exceeded');
      }
    }

    // Refill tokens
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;

    // Wait if no tokens available
    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate;
      await sleep(waitTime);
      this.tokens = 1;
    }

    this.tokens -= 1;
    this.dailyCount += 1;
  }
}

/**
 * HTTP client with rate limiting and retry logic
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;
  private readonly timeout: number;
  private rateLimiter?: RateLimiter;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.headers = options.headers ?? {};
    this.timeout = options.timeout ?? 30000;
  }

  setRateLimiter(config: RateLimitConfig): void {
    this.rateLimiter = new RateLimiter(config);
  }

  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.headers,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, await response.text());
      }

      return await response.json() as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    if (this.rateLimiter) {
      await this.rateLimiter.acquire();
    }

    const url = new URL(path, this.baseUrl);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, await response.text());
      }

      return await response.json() as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'HttpError';
  }
}
