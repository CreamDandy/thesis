import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StocksTable } from './stocks-table';
import { StocksFilters } from './stocks-filters';

// Mock data - will be replaced with real API calls when DB is seeded
const MOCK_STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Information Technology', price: 178.72, changePercent: 1.24, marketCap: 2800000000000, pe: 28.5 },
  { ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Information Technology', price: 378.91, changePercent: 0.87, marketCap: 2810000000000, pe: 35.2 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', price: 141.80, changePercent: -0.45, marketCap: 1780000000000, pe: 24.1 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', price: 178.25, changePercent: 2.15, marketCap: 1850000000000, pe: 62.3 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Information Technology', price: 495.22, changePercent: 3.42, marketCap: 1220000000000, pe: 65.8 },
  { ticker: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', price: 505.95, changePercent: -1.23, marketCap: 1290000000000, pe: 32.4 },
  { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', price: 248.50, changePercent: -2.87, marketCap: 790000000000, pe: 72.1 },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', price: 195.42, changePercent: 0.56, marketCap: 565000000000, pe: 11.2 },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Health Care', price: 156.78, changePercent: -0.12, marketCap: 378000000000, pe: 15.8 },
  { ticker: 'UNH', name: 'UnitedHealth Group', sector: 'Health Care', price: 528.34, changePercent: 0.98, marketCap: 487000000000, pe: 22.4 },
  { ticker: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', price: 104.56, changePercent: 1.67, marketCap: 418000000000, pe: 10.5 },
  { ticker: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', price: 158.92, changePercent: 0.23, marketCap: 374000000000, pe: 26.3 },
  { ticker: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary', price: 345.67, changePercent: -0.78, marketCap: 344000000000, pe: 23.1 },
  { ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', price: 287.45, changePercent: 1.89, marketCap: 144000000000, pe: 16.7 },
  { ticker: 'NEE', name: 'NextEra Energy Inc.', sector: 'Utilities', price: 72.34, changePercent: 0.45, marketCap: 149000000000, pe: 21.2 },
];

export default function StocksPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
        <p className="text-muted-foreground mt-2">Browse S&amp;P 100 stocks</p>
      </div>

      <div className="space-y-6">
        <StocksFilters />
        
        <Card>
          <CardHeader>
            <CardTitle>S&amp;P 100 Stocks</CardTitle>
            <CardDescription>
              Click on any stock to view detailed analysis and research
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StocksTable stocks={MOCK_STOCKS} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
