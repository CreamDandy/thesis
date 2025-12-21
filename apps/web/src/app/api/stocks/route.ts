import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq, desc, asc, and, gte, lte, sql } from 'drizzle-orm';
import { db, stocks, quotes, fundamentals } from '@/lib/db';

// Query params validation schema
const querySchema = z.object({
  sector: z.string().optional(),
  minMarketCap: z.coerce.number().optional(),
  maxMarketCap: z.coerce.number().optional(),
  minPe: z.coerce.number().optional(),
  maxPe: z.coerce.number().optional(),
  sortBy: z.enum(['ticker', 'name', 'marketCap', 'price', 'changePercent', 'pe']).default('ticker'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validationResult = querySchema.safeParse(params);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sector, minMarketCap, maxMarketCap, minPe, maxPe, sortBy, sortOrder, page, limit } =
      validationResult.data;

    // Build conditions array
    const conditions: ReturnType<typeof eq>[] = [];

    if (sector) {
      conditions.push(eq(stocks.sector, sector));
    }

    // Subquery for latest quote per ticker
    const latestQuote = db
      .select({
        ticker: quotes.ticker,
        maxTimestamp: sql<Date>`MAX(${quotes.timestamp})`.as('max_timestamp'),
      })
      .from(quotes)
      .groupBy(quotes.ticker)
      .as('latest_quote');

    // Subquery for latest fundamentals per ticker
    const latestFundamentals = db
      .select({
        ticker: fundamentals.ticker,
        maxDate: sql<Date>`MAX(${fundamentals.asOfDate})`.as('max_date'),
      })
      .from(fundamentals)
      .groupBy(fundamentals.ticker)
      .as('latest_fundamentals');

    // Build the main query with joins
    let query = db
      .select({
        // Stock fields
        ticker: stocks.ticker,
        name: stocks.name,
        exchange: stocks.exchange,
        sector: stocks.sector,
        industry: stocks.industry,
        marketCap: stocks.marketCap,
        description: stocks.description,
        logoUrl: stocks.logoUrl,
        isActive: stocks.isActive,
        isSP100: stocks.isSP100,
        isSP500: stocks.isSP500,
        // Quote fields
        price: quotes.price,
        open: quotes.open,
        high: quotes.high,
        low: quotes.low,
        previousClose: quotes.previousClose,
        change: quotes.change,
        changePercent: quotes.changePercent,
        volume: quotes.volume,
        week52High: quotes.week52High,
        week52Low: quotes.week52Low,
        quoteTimestamp: quotes.timestamp,
        // Fundamental fields
        pe: fundamentals.pe,
        forwardPe: fundamentals.forwardPe,
        ps: fundamentals.ps,
        pb: fundamentals.pb,
        evEbitda: fundamentals.evEbitda,
        dividendYield: fundamentals.dividendYield,
        eps: fundamentals.eps,
        roe: fundamentals.roe,
        netMargin: fundamentals.netMargin,
      })
      .from(stocks)
      .leftJoin(latestQuote, eq(stocks.ticker, latestQuote.ticker))
      .leftJoin(
        quotes,
        and(eq(stocks.ticker, quotes.ticker), eq(quotes.timestamp, latestQuote.maxTimestamp))
      )
      .leftJoin(latestFundamentals, eq(stocks.ticker, latestFundamentals.ticker))
      .leftJoin(
        fundamentals,
        and(
          eq(stocks.ticker, fundamentals.ticker),
          eq(fundamentals.asOfDate, latestFundamentals.maxDate)
        )
      )
      .$dynamic();

    // Apply filters
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply market cap filters on stock table
    if (minMarketCap !== undefined) {
      query = query.where(gte(stocks.marketCap, minMarketCap));
    }
    if (maxMarketCap !== undefined) {
      query = query.where(lte(stocks.marketCap, maxMarketCap));
    }

    // Apply PE filters on fundamentals
    if (minPe !== undefined) {
      query = query.where(gte(fundamentals.pe, minPe));
    }
    if (maxPe !== undefined) {
      query = query.where(lte(fundamentals.pe, maxPe));
    }

    // Apply sorting
    const sortColumn = {
      ticker: stocks.ticker,
      name: stocks.name,
      marketCap: stocks.marketCap,
      price: quotes.price,
      changePercent: quotes.changePercent,
      pe: fundamentals.pe,
    }[sortBy];

    const orderFn = sortOrder === 'desc' ? desc : asc;
    query = query.orderBy(orderFn(sortColumn));

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    // Execute query
    const results = await query;

    // Get total count for pagination
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(stocks)
      .$dynamic();

    // Apply same filters for count
    let countWithFilters = countQuery;
    if (sector) {
      countWithFilters = countWithFilters.where(eq(stocks.sector, sector));
    }
    if (minMarketCap !== undefined) {
      countWithFilters = countWithFilters.where(gte(stocks.marketCap, minMarketCap));
    }
    if (maxMarketCap !== undefined) {
      countWithFilters = countWithFilters.where(lte(stocks.marketCap, maxMarketCap));
    }

    const [{ count: totalCount }] = await countWithFilters;

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        limit,
        totalCount: Number(totalCount),
        totalPages: Math.ceil(Number(totalCount) / limit),
        hasNextPage: page * limit < Number(totalCount),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
