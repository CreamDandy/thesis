import { NextRequest, NextResponse } from 'next/server';
import { eq, and, desc } from 'drizzle-orm';
import { db, stocks, quotes, fundamentals } from '@/lib/db';

type RouteParams = {
  params: Promise<{ ticker: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { ticker } = await params;
    const upperTicker = ticker.toUpperCase();

    // Fetch stock data
    const [stock] = await db
      .select()
      .from(stocks)
      .where(eq(stocks.ticker, upperTicker))
      .limit(1);

    if (!stock) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    // Fetch latest quote
    const [latestQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.ticker, upperTicker))
      .orderBy(desc(quotes.timestamp))
      .limit(1);

    // Fetch latest fundamentals
    const [latestFundamentals] = await db
      .select()
      .from(fundamentals)
      .where(eq(fundamentals.ticker, upperTicker))
      .orderBy(desc(fundamentals.asOfDate))
      .limit(1);

    return NextResponse.json({
      data: {
        stock,
        quote: latestQuote ?? null,
        fundamentals: latestFundamentals ?? null,
      },
    });
  } catch (error) {
    console.error('Error fetching stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
