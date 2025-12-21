import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockStockData, getMockNews } from '@/lib/mock-stock-data';
import { StockHeader } from './stock-header';
import { OverviewTab } from './overview-tab';
import { ReportTab } from './report-tab';
import { FinancialsTab } from './financials-tab';
import { NewsTab } from './news-tab';

interface StockDetailPageProps {
  params: Promise<{
    ticker: string;
  }>;
}

export async function generateMetadata({ params }: StockDetailPageProps) {
  const { ticker } = await params;
  const stock = getMockStockData(ticker);

  return {
    title: `${stock.name} (${stock.ticker}) - Stock Analysis`,
    description: `View detailed stock analysis, financials, and AI-generated reports for ${stock.name} (${stock.ticker}).`,
  };
}

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { ticker } = await params;

  if (!ticker) {
    notFound();
  }

  const stock = getMockStockData(ticker);
  const news = getMockNews(ticker);

  return (
    <div className="container py-8">
      {/* Back Link */}
      <Link
        href="/stocks"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <svg
          className="mr-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Stocks
      </Link>

      {/* Stock Header */}
      <div className="mb-8">
        <StockHeader stock={stock} />
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab stock={stock} />
        </TabsContent>

        <TabsContent value="report">
          <ReportTab stock={stock} />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialsTab stock={stock} />
        </TabsContent>

        <TabsContent value="news">
          <NewsTab ticker={stock.ticker} news={news} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
