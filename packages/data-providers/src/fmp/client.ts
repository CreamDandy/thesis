import { z } from 'zod';
import { HttpClient, RateLimitConfig } from '../utils/http.js';
import { RATE_LIMITS } from '@thesis/shared';

// =============================================================================
// FMP Response Schemas
// =============================================================================

const FMPQuoteSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  changesPercentage: z.number(),
  change: z.number(),
  dayLow: z.number(),
  dayHigh: z.number(),
  yearHigh: z.number(),
  yearLow: z.number(),
  marketCap: z.number(),
  priceAvg50: z.number(),
  priceAvg200: z.number(),
  exchange: z.string(),
  volume: z.number(),
  avgVolume: z.number(),
  open: z.number(),
  previousClose: z.number(),
  eps: z.number().nullable(),
  pe: z.number().nullable(),
  earningsAnnouncement: z.string().nullable(),
  sharesOutstanding: z.number(),
  timestamp: z.number(),
});

const FMPProfileSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  exchange: z.string(),
  industry: z.string(),
  sector: z.string(),
  description: z.string(),
  ceo: z.string().nullable(),
  website: z.string().nullable(),
  image: z.string().nullable(),
  ipoDate: z.string().nullable(),
  mktCap: z.number(),
  fullTimeEmployees: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  isEtf: z.boolean(),
  isActivelyTrading: z.boolean(),
});

const FMPRatiosSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  period: z.string(),
  currentRatio: z.number().nullable(),
  quickRatio: z.number().nullable(),
  cashRatio: z.number().nullable(),
  daysOfSalesOutstanding: z.number().nullable(),
  daysOfInventoryOutstanding: z.number().nullable(),
  operatingCycle: z.number().nullable(),
  daysOfPayablesOutstanding: z.number().nullable(),
  cashConversionCycle: z.number().nullable(),
  grossProfitMargin: z.number().nullable(),
  operatingProfitMargin: z.number().nullable(),
  pretaxProfitMargin: z.number().nullable(),
  netProfitMargin: z.number().nullable(),
  effectiveTaxRate: z.number().nullable(),
  returnOnAssets: z.number().nullable(),
  returnOnEquity: z.number().nullable(),
  returnOnCapitalEmployed: z.number().nullable(),
  netIncomePerEBT: z.number().nullable(),
  ebtPerEbit: z.number().nullable(),
  ebitPerRevenue: z.number().nullable(),
  debtRatio: z.number().nullable(),
  debtEquityRatio: z.number().nullable(),
  longTermDebtToCapitalization: z.number().nullable(),
  totalDebtToCapitalization: z.number().nullable(),
  interestCoverage: z.number().nullable(),
  cashFlowToDebtRatio: z.number().nullable(),
  companyEquityMultiplier: z.number().nullable(),
  receivablesTurnover: z.number().nullable(),
  payablesTurnover: z.number().nullable(),
  inventoryTurnover: z.number().nullable(),
  fixedAssetTurnover: z.number().nullable(),
  assetTurnover: z.number().nullable(),
  operatingCashFlowPerShare: z.number().nullable(),
  freeCashFlowPerShare: z.number().nullable(),
  cashPerShare: z.number().nullable(),
  payoutRatio: z.number().nullable(),
  operatingCashFlowSalesRatio: z.number().nullable(),
  freeCashFlowOperatingCashFlowRatio: z.number().nullable(),
  cashFlowCoverageRatios: z.number().nullable(),
  shortTermCoverageRatios: z.number().nullable(),
  capitalExpenditureCoverageRatio: z.number().nullable(),
  dividendPaidAndCapexCoverageRatio: z.number().nullable(),
  dividendPayoutRatio: z.number().nullable(),
  priceBookValueRatio: z.number().nullable(),
  priceToBookRatio: z.number().nullable(),
  priceToSalesRatio: z.number().nullable(),
  priceEarningsRatio: z.number().nullable(),
  priceToFreeCashFlowsRatio: z.number().nullable(),
  priceToOperatingCashFlowsRatio: z.number().nullable(),
  priceCashFlowRatio: z.number().nullable(),
  priceEarningsToGrowthRatio: z.number().nullable(),
  priceSalesRatio: z.number().nullable(),
  dividendYield: z.number().nullable(),
  enterpriseValueMultiple: z.number().nullable(),
  priceFairValue: z.number().nullable(),
});

const FMPKeyMetricsSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  period: z.string(),
  revenuePerShare: z.number().nullable(),
  netIncomePerShare: z.number().nullable(),
  operatingCashFlowPerShare: z.number().nullable(),
  freeCashFlowPerShare: z.number().nullable(),
  cashPerShare: z.number().nullable(),
  bookValuePerShare: z.number().nullable(),
  tangibleBookValuePerShare: z.number().nullable(),
  shareholdersEquityPerShare: z.number().nullable(),
  interestDebtPerShare: z.number().nullable(),
  marketCap: z.number().nullable(),
  enterpriseValue: z.number().nullable(),
  peRatio: z.number().nullable(),
  priceToSalesRatio: z.number().nullable(),
  pocfratio: z.number().nullable(),
  pfcfRatio: z.number().nullable(),
  pbRatio: z.number().nullable(),
  ptbRatio: z.number().nullable(),
  evToSales: z.number().nullable(),
  enterpriseValueOverEBITDA: z.number().nullable(),
  evToOperatingCashFlow: z.number().nullable(),
  evToFreeCashFlow: z.number().nullable(),
  earningsYield: z.number().nullable(),
  freeCashFlowYield: z.number().nullable(),
  debtToEquity: z.number().nullable(),
  debtToAssets: z.number().nullable(),
  netDebtToEBITDA: z.number().nullable(),
  currentRatio: z.number().nullable(),
  interestCoverage: z.number().nullable(),
  incomeQuality: z.number().nullable(),
  dividendYield: z.number().nullable(),
  payoutRatio: z.number().nullable(),
  salesGeneralAndAdministrativeToRevenue: z.number().nullable(),
  researchAndDdevelopementToRevenue: z.number().nullable(),
  intangiblesToTotalAssets: z.number().nullable(),
  capexToOperatingCashFlow: z.number().nullable(),
  capexToRevenue: z.number().nullable(),
  capexToDepreciation: z.number().nullable(),
  stockBasedCompensationToRevenue: z.number().nullable(),
  grahamNumber: z.number().nullable(),
  roic: z.number().nullable(),
  returnOnTangibleAssets: z.number().nullable(),
  grahamNetNet: z.number().nullable(),
  workingCapital: z.number().nullable(),
  tangibleAssetValue: z.number().nullable(),
  netCurrentAssetValue: z.number().nullable(),
  investedCapital: z.number().nullable(),
  averageReceivables: z.number().nullable(),
  averagePayables: z.number().nullable(),
  averageInventory: z.number().nullable(),
  daysSalesOutstanding: z.number().nullable(),
  daysPayablesOutstanding: z.number().nullable(),
  daysOfInventoryOnHand: z.number().nullable(),
  receivablesTurnover: z.number().nullable(),
  payablesTurnover: z.number().nullable(),
  inventoryTurnover: z.number().nullable(),
  roe: z.number().nullable(),
  capexPerShare: z.number().nullable(),
});

const FMPGrowthSchema = z.object({
  symbol: z.string(),
  date: z.string(),
  period: z.string(),
  revenueGrowth: z.number().nullable(),
  grossProfitGrowth: z.number().nullable(),
  ebitgrowth: z.number().nullable(),
  operatingIncomeGrowth: z.number().nullable(),
  netIncomeGrowth: z.number().nullable(),
  epsgrowth: z.number().nullable(),
  epsdilutedGrowth: z.number().nullable(),
  weightedAverageSharesGrowth: z.number().nullable(),
  weightedAverageSharesDilutedGrowth: z.number().nullable(),
  dividendsperShareGrowth: z.number().nullable(),
  operatingCashFlowGrowth: z.number().nullable(),
  freeCashFlowGrowth: z.number().nullable(),
  tenYRevenueGrowthPerShare: z.number().nullable(),
  fiveYRevenueGrowthPerShare: z.number().nullable(),
  threeYRevenueGrowthPerShare: z.number().nullable(),
  tenYOperatingCFGrowthPerShare: z.number().nullable(),
  fiveYOperatingCFGrowthPerShare: z.number().nullable(),
  threeYOperatingCFGrowthPerShare: z.number().nullable(),
  tenYNetIncomeGrowthPerShare: z.number().nullable(),
  fiveYNetIncomeGrowthPerShare: z.number().nullable(),
  threeYNetIncomeGrowthPerShare: z.number().nullable(),
  tenYShareholdersEquityGrowthPerShare: z.number().nullable(),
  fiveYShareholdersEquityGrowthPerShare: z.number().nullable(),
  threeYShareholdersEquityGrowthPerShare: z.number().nullable(),
  tenYDividendperShareGrowthPerShare: z.number().nullable(),
  fiveYDividendperShareGrowthPerShare: z.number().nullable(),
  threeYDividendperShareGrowthPerShare: z.number().nullable(),
  receivablesGrowth: z.number().nullable(),
  inventoryGrowth: z.number().nullable(),
  assetGrowth: z.number().nullable(),
  bookValueperShareGrowth: z.number().nullable(),
  debtGrowth: z.number().nullable(),
  rdexpenseGrowth: z.number().nullable(),
  sgaexpensesGrowth: z.number().nullable(),
});

// =============================================================================
// Parsed Types
// =============================================================================

export interface FMPQuote {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  sma50: number;
  sma200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number | null;
  pe: number | null;
  earningsDate: string | null;
  sharesOutstanding: number;
  timestamp: Date;
}

export interface FMPProfile {
  ticker: string;
  name: string;
  exchange: string;
  industry: string;
  sector: string;
  description: string;
  ceo: string | null;
  website: string | null;
  logoUrl: string | null;
  ipoDate: string | null;
  marketCap: number;
  employees: number | null;
  country: string | null;
  isEtf: boolean;
  isActive: boolean;
}

export interface FMPFundamentals {
  ticker: string;
  date: string;
  // Valuation
  pe: number | null;
  pb: number | null;
  ps: number | null;
  peg: number | null;
  evEbitda: number | null;
  enterpriseValue: number | null;
  // Profitability
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  roe: number | null;
  roa: number | null;
  roic: number | null;
  // Dividends
  dividendYield: number | null;
  payoutRatio: number | null;
  // Balance Sheet
  debtToEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
  interestCoverage: number | null;
  // Per Share
  bookValue: number | null;
  fcfPerShare: number | null;
  revenuePerShare: number | null;
  // Growth
  revenueGrowthYoY: number | null;
  epsGrowthYoY: number | null;
  revenueGrowth3Y: number | null;
  epsGrowth3Y: number | null;
}

// =============================================================================
// FMP Client
// =============================================================================

export class FMPClient {
  private readonly client: HttpClient;
  private readonly apiKey: string;

  constructor(apiKey: string, rateLimitConfig?: RateLimitConfig) {
    this.apiKey = apiKey;
    this.client = new HttpClient({
      baseUrl: 'https://financialmodelingprep.com/api/v3',
    });
    this.client.setRateLimiter(rateLimitConfig ?? RATE_LIMITS.fmp);
  }

  /**
   * Get real-time quote for a ticker
   */
  async getQuote(ticker: string): Promise<FMPQuote> {
    const response = await this.client.get<unknown[]>(`/quote/${ticker}`, {
      apikey: this.apiKey,
    });

    const parsed = z.array(FMPQuoteSchema).parse(response);
    if (parsed.length === 0) {
      throw new Error(`No quote found for ${ticker}`);
    }

    const quote = parsed[0]!;
    return {
      ticker: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changesPercentage,
      dayLow: quote.dayLow,
      dayHigh: quote.dayHigh,
      yearHigh: quote.yearHigh,
      yearLow: quote.yearLow,
      marketCap: quote.marketCap,
      sma50: quote.priceAvg50,
      sma200: quote.priceAvg200,
      exchange: quote.exchange,
      volume: quote.volume,
      avgVolume: quote.avgVolume,
      open: quote.open,
      previousClose: quote.previousClose,
      eps: quote.eps,
      pe: quote.pe,
      earningsDate: quote.earningsAnnouncement,
      sharesOutstanding: quote.sharesOutstanding,
      timestamp: new Date(quote.timestamp * 1000),
    };
  }

  /**
   * Get company profile
   */
  async getProfile(ticker: string): Promise<FMPProfile> {
    const response = await this.client.get<unknown[]>(`/profile/${ticker}`, {
      apikey: this.apiKey,
    });

    const parsed = z.array(FMPProfileSchema).parse(response);
    if (parsed.length === 0) {
      throw new Error(`No profile found for ${ticker}`);
    }

    const profile = parsed[0]!;
    return {
      ticker: profile.symbol,
      name: profile.companyName,
      exchange: profile.exchange,
      industry: profile.industry,
      sector: profile.sector,
      description: profile.description,
      ceo: profile.ceo,
      website: profile.website,
      logoUrl: profile.image,
      ipoDate: profile.ipoDate,
      marketCap: profile.mktCap,
      employees: profile.fullTimeEmployees ? parseInt(profile.fullTimeEmployees, 10) : null,
      country: profile.country,
      isEtf: profile.isEtf,
      isActive: profile.isActivelyTrading,
    };
  }

  /**
   * Get comprehensive fundamentals (ratios + key metrics + growth)
   */
  async getFundamentals(ticker: string): Promise<FMPFundamentals> {
    const [ratiosRes, metricsRes, growthRes] = await Promise.all([
      this.client.get<unknown[]>(`/ratios-ttm/${ticker}`, { apikey: this.apiKey }),
      this.client.get<unknown[]>(`/key-metrics-ttm/${ticker}`, { apikey: this.apiKey }),
      this.client.get<unknown[]>(`/financial-growth/${ticker}`, { apikey: this.apiKey, limit: 1 }),
    ]);

    const ratios = z.array(FMPRatiosSchema).parse(ratiosRes)[0];
    const metrics = z.array(FMPKeyMetricsSchema).parse(metricsRes)[0];
    const growth = z.array(FMPGrowthSchema).parse(growthRes)[0];

    return {
      ticker,
      date: ratios?.date ?? new Date().toISOString().split('T')[0]!,
      // Valuation
      pe: metrics?.peRatio ?? ratios?.priceEarningsRatio ?? null,
      pb: metrics?.pbRatio ?? ratios?.priceToBookRatio ?? null,
      ps: metrics?.priceToSalesRatio ?? ratios?.priceToSalesRatio ?? null,
      peg: ratios?.priceEarningsToGrowthRatio ?? null,
      evEbitda: metrics?.enterpriseValueOverEBITDA ?? ratios?.enterpriseValueMultiple ?? null,
      enterpriseValue: metrics?.enterpriseValue ?? null,
      // Profitability
      grossMargin: ratios?.grossProfitMargin ?? null,
      operatingMargin: ratios?.operatingProfitMargin ?? null,
      netMargin: ratios?.netProfitMargin ?? null,
      roe: metrics?.roe ?? ratios?.returnOnEquity ?? null,
      roa: ratios?.returnOnAssets ?? null,
      roic: metrics?.roic ?? null,
      // Dividends
      dividendYield: metrics?.dividendYield ?? ratios?.dividendYield ?? null,
      payoutRatio: metrics?.payoutRatio ?? ratios?.payoutRatio ?? null,
      // Balance Sheet
      debtToEquity: metrics?.debtToEquity ?? ratios?.debtEquityRatio ?? null,
      currentRatio: metrics?.currentRatio ?? ratios?.currentRatio ?? null,
      quickRatio: ratios?.quickRatio ?? null,
      interestCoverage: metrics?.interestCoverage ?? ratios?.interestCoverage ?? null,
      // Per Share
      bookValue: metrics?.bookValuePerShare ?? null,
      fcfPerShare: metrics?.freeCashFlowPerShare ?? ratios?.freeCashFlowPerShare ?? null,
      revenuePerShare: metrics?.revenuePerShare ?? null,
      // Growth
      revenueGrowthYoY: growth?.revenueGrowth ?? null,
      epsGrowthYoY: growth?.epsgrowth ?? null,
      revenueGrowth3Y: growth?.threeYRevenueGrowthPerShare ?? null,
      epsGrowth3Y: growth?.threeYNetIncomeGrowthPerShare ?? null,
    };
  }

  /**
   * Get S&P 500 constituents
   */
  async getSP500Constituents(): Promise<string[]> {
    const response = await this.client.get<{ symbol: string }[]>('/sp500_constituent', {
      apikey: this.apiKey,
    });

    return response.map((item) => item.symbol);
  }

  /**
   * Get multiple quotes
   */
  async getQuotes(tickers: string[]): Promise<Map<string, FMPQuote>> {
    const results = new Map<string, FMPQuote>();
    
    // FMP supports batch quotes
    const batchSize = 50;
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      const symbols = batch.join(',');
      
      try {
        const response = await this.client.get<unknown[]>(`/quote/${symbols}`, {
          apikey: this.apiKey,
        });

        const parsed = z.array(FMPQuoteSchema).parse(response);
        for (const quote of parsed) {
          results.set(quote.symbol, {
            ticker: quote.symbol,
            name: quote.name,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changesPercentage,
            dayLow: quote.dayLow,
            dayHigh: quote.dayHigh,
            yearHigh: quote.yearHigh,
            yearLow: quote.yearLow,
            marketCap: quote.marketCap,
            sma50: quote.priceAvg50,
            sma200: quote.priceAvg200,
            exchange: quote.exchange,
            volume: quote.volume,
            avgVolume: quote.avgVolume,
            open: quote.open,
            previousClose: quote.previousClose,
            eps: quote.eps,
            pe: quote.pe,
            earningsDate: quote.earningsAnnouncement,
            sharesOutstanding: quote.sharesOutstanding,
            timestamp: new Date(quote.timestamp * 1000),
          });
        }
      } catch (error) {
        console.error(`Failed to fetch batch quotes:`, error);
      }
    }

    return results;
  }
}
