import { NextRequest, NextResponse } from 'next/server';
import { eq, desc } from 'drizzle-orm';
import { db, stocks, quotes } from '@/lib/db';

type RouteParams = {
  params: Promise<{ ticker: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { ticker } = await params;
    const upperTicker = ticker.toUpperCase();

    // Verify stock exists
    const [stock] = await db
      .select({ ticker: stocks.ticker })
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

    if (!latestQuote) {
      return NextResponse.json(
        { error: 'No quote data available for this stock' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: latestQuote,
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
