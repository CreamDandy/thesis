import { z } from 'zod';
import { HttpClient, RateLimitConfig } from '../utils/http.js';
import { RATE_LIMITS } from '@thesis/shared';

// =============================================================================
// Alpha Vantage Response Schemas
// =============================================================================

const GlobalQuoteSchema = z.object({
  'Global Quote': z.object({
    '01. symbol': z.string(),
    '02. open': z.string(),
    '03. high': z.string(),
    '04. low': z.string(),
    '05. price': z.string(),
    '06. volume': z.string(),
    '07. latest trading day': z.string(),
    '08. previous close': z.string(),
    '09. change': z.string(),
    '10. change percent': z.string(),
  }),
});

const CompanyOverviewSchema = z.object({
  Symbol: z.string(),
  Name: z.string(),
  Description: z.string(),
  Exchange: z.string(),
  Sector: z.string(),
  Industry: z.string(),
  MarketCapitalization: z.string(),
  PERatio: z.string(),
  PEGRatio: z.string(),
  BookValue: z.string(),
  DividendPerShare: z.string(),
  DividendYield: z.string(),
  EPS: z.string(),
  ProfitMargin: z.string(),
  OperatingMarginTTM: z.string(),
  ReturnOnAssetsTTM: z.string(),
  ReturnOnEquityTTM: z.string(),
  RevenueTTM: z.string(),
  GrossProfitTTM: z.string(),
  QuarterlyEarningsGrowthYOY: z.string(),
  QuarterlyRevenueGrowthYOY: z.string(),
  AnalystTargetPrice: z.string(),
  TrailingPE: z.string(),
  ForwardPE: z.string(),
  PriceToSalesRatioTTM: z.string(),
  PriceToBookRatio: z.string(),
  EVToRevenue: z.string(),
  EVToEBITDA: z.string(),
  Beta: z.string(),
  '52WeekHigh': z.string(),
  '52WeekLow': z.string(),
  '50DayMovingAverage': z.string(),
  '200DayMovingAverage': z.string(),
  SharesOutstanding: z.string(),
  DividendDate: z.string().optional(),
  ExDividendDate: z.string().optional(),
});

// =============================================================================
// Parsed Types
// =============================================================================

export interface AlphaVantageQuote {
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
  change: number;
  changePercent: number;
  latestTradingDay: string;
}

export interface AlphaVantageOverview {
  ticker: string;
  name: string;
  description: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCap: number;
  pe: number | null;
  peg: number | null;
  bookValue: number | null;
  dividendYield: number | null;
  eps: number | null;
  profitMargin: number | null;
  operatingMargin: number | null;
  roa: number | null;
  roe: number | null;
  revenue: number | null;
  grossProfit: number | null;
  epsGrowthYoY: number | null;
  revenueGrowthYoY: number | null;
  analystTargetPrice: number | null;
  forwardPe: number | null;
  ps: number | null;
  pb: number | null;
  evToRevenue: number | null;
  evToEbitda: number | null;
  beta: number | null;
  week52High: number | null;
  week52Low: number | null;
  sma50: number | null;
  sma200: number | null;
  sharesOutstanding: number | null;
  exDividendDate: string | null;
}

// =============================================================================
// Alpha Vantage Client
// =============================================================================

export class AlphaVantageClient {
  private readonly client: HttpClient;
  private readonly apiKey: string;

  constructor(apiKey: string, rateLimitConfig?: RateLimitConfig) {
    this.apiKey = apiKey;
    this.client = new HttpClient({
      baseUrl: 'https://www.alphavantage.co',
    });
    this.client.setRateLimiter(rateLimitConfig ?? RATE_LIMITS.alphaVantage);
  }

  /**
   * Get real-time quote for a ticker
   */
  async getQuote(ticker: string): Promise<AlphaVantageQuote> {
    const response = await this.client.get<unknown>('/query', {
      function: 'GLOBAL_QUOTE',
      symbol: ticker,
      apikey: this.apiKey,
    });

    const parsed = GlobalQuoteSchema.parse(response);
    const quote = parsed['Global Quote'];

    return {
      ticker: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume'], 10),
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      latestTradingDay: quote['07. latest trading day'],
    };
  }

  /**
   * Get company overview with fundamentals
   */
  async getOverview(ticker: string): Promise<AlphaVantageOverview> {
    const response = await this.client.get<unknown>('/query', {
      function: 'OVERVIEW',
      symbol: ticker,
      apikey: this.apiKey,
    });

    const parsed = CompanyOverviewSchema.parse(response);

    const parseNumber = (value: string): number | null => {
      if (!value || value === 'None' || value === '-') return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    return {
      ticker: parsed.Symbol,
      name: parsed.Name,
      description: parsed.Description,
      exchange: parsed.Exchange,
      sector: parsed.Sector,
      industry: parsed.Industry,
      marketCap: parseNumber(parsed.MarketCapitalization) ?? 0,
      pe: parseNumber(parsed.PERatio),
      peg: parseNumber(parsed.PEGRatio),
      bookValue: parseNumber(parsed.BookValue),
      dividendYield: parseNumber(parsed.DividendYield),
      eps: parseNumber(parsed.EPS),
      profitMargin: parseNumber(parsed.ProfitMargin),
      operatingMargin: parseNumber(parsed.OperatingMarginTTM),
      roa: parseNumber(parsed.ReturnOnAssetsTTM),
      roe: parseNumber(parsed.ReturnOnEquityTTM),
      revenue: parseNumber(parsed.RevenueTTM),
      grossProfit: parseNumber(parsed.GrossProfitTTM),
      epsGrowthYoY: parseNumber(parsed.QuarterlyEarningsGrowthYOY),
      revenueGrowthYoY: parseNumber(parsed.QuarterlyRevenueGrowthYOY),
      analystTargetPrice: parseNumber(parsed.AnalystTargetPrice),
      forwardPe: parseNumber(parsed.ForwardPE),
      ps: parseNumber(parsed.PriceToSalesRatioTTM),
      pb: parseNumber(parsed.PriceToBookRatio),
      evToRevenue: parseNumber(parsed.EVToRevenue),
      evToEbitda: parseNumber(parsed.EVToEBITDA),
      beta: parseNumber(parsed.Beta),
      week52High: parseNumber(parsed['52WeekHigh']),
      week52Low: parseNumber(parsed['52WeekLow']),
      sma50: parseNumber(parsed['50DayMovingAverage']),
      sma200: parseNumber(parsed['200DayMovingAverage']),
      sharesOutstanding: parseNumber(parsed.SharesOutstanding),
      exDividendDate: parsed.ExDividendDate || null,
    };
  }

  /**
   * Get multiple quotes (batched with rate limiting)
   */
  async getQuotes(tickers: string[]): Promise<Map<string, AlphaVantageQuote>> {
    const results = new Map<string, AlphaVantageQuote>();

    for (const ticker of tickers) {
      try {
        const quote = await this.getQuote(ticker);
        results.set(ticker, quote);
      } catch (error) {
        console.error(`Failed to fetch quote for ${ticker}:`, error);
      }
    }

    return results;
  }
}
