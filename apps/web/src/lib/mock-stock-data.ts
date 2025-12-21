export interface StockData {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  pe: number;
  forwardPE: number;
  eps: number;
  dividendYield: number;
  payoutRatio: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  avgVolume: number;
  roe: number;
  netMargin: number;
  debtToEquity: number;
  description: string;
  revenue: number;
  netIncome: number;
  freeCashFlow: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  date: string;
  summary: string;
}

const MOCK_STOCKS: Record<string, StockData> = {
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Information Technology',
    price: 178.72,
    change: 2.18,
    changePercent: 1.24,
    marketCap: 2800000000000,
    pe: 28.5,
    forwardPE: 26.2,
    eps: 6.27,
    dividendYield: 0.52,
    payoutRatio: 15.2,
    weekHigh52: 199.62,
    weekLow52: 143.90,
    volume: 54230000,
    avgVolume: 58120000,
    roe: 147.2,
    netMargin: 25.3,
    debtToEquity: 181.2,
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories. It also provides AppleCare support and cloud services, and operates various platforms including the App Store.',
    revenue: 383290000000,
    netIncome: 96995000000,
    freeCashFlow: 99584000000,
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Information Technology',
    price: 378.91,
    change: 3.27,
    changePercent: 0.87,
    marketCap: 2810000000000,
    pe: 35.2,
    forwardPE: 31.8,
    eps: 10.76,
    dividendYield: 0.74,
    payoutRatio: 25.8,
    weekHigh52: 420.82,
    weekLow52: 309.45,
    volume: 21450000,
    avgVolume: 24560000,
    roe: 38.5,
    netMargin: 34.2,
    debtToEquity: 42.1,
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates in three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing. It offers Office, LinkedIn, and Dynamics products, as well as Azure cloud services.',
    revenue: 211915000000,
    netIncome: 72361000000,
    freeCashFlow: 63305000000,
  },
  GOOGL: {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Communication Services',
    price: 141.80,
    change: -0.64,
    changePercent: -0.45,
    marketCap: 1780000000000,
    pe: 24.1,
    forwardPE: 21.5,
    eps: 5.88,
    dividendYield: 0.0,
    payoutRatio: 0,
    weekHigh52: 153.78,
    weekLow52: 115.83,
    volume: 28340000,
    avgVolume: 31200000,
    roe: 25.3,
    netMargin: 21.4,
    debtToEquity: 10.8,
    description: 'Alphabet Inc. offers various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments. The company provides Google Search, YouTube, Android, Chrome, and Google Play.',
    revenue: 307394000000,
    netIncome: 73795000000,
    freeCashFlow: 60010000000,
  },
  AMZN: {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    sector: 'Consumer Discretionary',
    price: 178.25,
    change: 3.75,
    changePercent: 2.15,
    marketCap: 1850000000000,
    pe: 62.3,
    forwardPE: 42.1,
    eps: 2.86,
    dividendYield: 0.0,
    payoutRatio: 0,
    weekHigh52: 191.70,
    weekLow52: 118.35,
    volume: 45670000,
    avgVolume: 52340000,
    roe: 15.1,
    netMargin: 5.3,
    debtToEquity: 83.5,
    description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. The company operates through three segments: North America, International, and Amazon Web Services (AWS).',
    revenue: 574785000000,
    netIncome: 30425000000,
    freeCashFlow: 36813000000,
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Information Technology',
    price: 495.22,
    change: 16.38,
    changePercent: 3.42,
    marketCap: 1220000000000,
    pe: 65.8,
    forwardPE: 35.2,
    eps: 7.53,
    dividendYield: 0.03,
    payoutRatio: 1.8,
    weekHigh52: 505.48,
    weekLow52: 222.97,
    volume: 42180000,
    avgVolume: 48920000,
    roe: 69.2,
    netMargin: 55.0,
    debtToEquity: 41.2,
    description: 'NVIDIA Corporation provides graphics, computing and networking solutions in the United States, Taiwan, China, and internationally. The company operates through two segments: Graphics and Compute & Networking. It offers GeForce GPUs for gaming and PCs, data center platforms, and AI solutions.',
    revenue: 60922000000,
    netIncome: 29760000000,
    freeCashFlow: 27021000000,
  },
  META: {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    sector: 'Communication Services',
    price: 505.95,
    change: -6.30,
    changePercent: -1.23,
    marketCap: 1290000000000,
    pe: 32.4,
    forwardPE: 24.8,
    eps: 15.61,
    dividendYield: 0.0,
    payoutRatio: 0,
    weekHigh52: 542.81,
    weekLow52: 274.38,
    volume: 15230000,
    avgVolume: 18450000,
    roe: 28.1,
    netMargin: 29.0,
    debtToEquity: 18.5,
    description: 'Meta Platforms, Inc. develops products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, wearables, and in-home devices worldwide. It operates in two segments: Family of Apps and Reality Labs.',
    revenue: 134902000000,
    netIncome: 39098000000,
    freeCashFlow: 43012000000,
  },
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Discretionary',
    price: 248.50,
    change: -7.35,
    changePercent: -2.87,
    marketCap: 790000000000,
    pe: 72.1,
    forwardPE: 55.8,
    eps: 3.45,
    dividendYield: 0.0,
    payoutRatio: 0,
    weekHigh52: 299.29,
    weekLow52: 152.37,
    volume: 112450000,
    avgVolume: 118230000,
    roe: 21.5,
    netMargin: 10.8,
    debtToEquity: 11.2,
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally. The company operates in two segments: Automotive, and Energy Generation and Storage.',
    revenue: 96773000000,
    netIncome: 12556000000,
    freeCashFlow: 4358000000,
  },
};

const DEFAULT_STOCK: StockData = {
  ticker: 'UNKNOWN',
  name: 'Unknown Company',
  sector: 'N/A',
  price: 100.00,
  change: 0.00,
  changePercent: 0.00,
  marketCap: 10000000000,
  pe: 20.0,
  forwardPE: 18.0,
  eps: 5.00,
  dividendYield: 2.0,
  payoutRatio: 40.0,
  weekHigh52: 120.00,
  weekLow52: 80.00,
  volume: 1000000,
  avgVolume: 1200000,
  roe: 15.0,
  netMargin: 10.0,
  debtToEquity: 50.0,
  description: 'Company information not available. This is placeholder data for demonstration purposes.',
  revenue: 10000000000,
  netIncome: 1000000000,
  freeCashFlow: 800000000,
};

export function getMockStockData(ticker: string): StockData {
  const upperTicker = ticker.toUpperCase();
  const stock = MOCK_STOCKS[upperTicker];
  
  if (stock) {
    return stock;
  }
  
  return {
    ...DEFAULT_STOCK,
    ticker: upperTicker,
    name: `${upperTicker} Corporation`,
  };
}

export function getMockNews(ticker: string): NewsItem[] {
  const upperTicker = ticker.toUpperCase();
  const now = new Date();
  
  return [
    {
      id: '1',
      headline: `${upperTicker} Announces Strong Q4 Results, Beats Analyst Expectations`,
      source: 'Reuters',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      summary: `${upperTicker} reported quarterly earnings that exceeded Wall Street expectations, driven by strong demand across key product segments and continued growth in services revenue.`,
    },
    {
      id: '2',
      headline: `Analysts Upgrade ${upperTicker} Following Product Launch`,
      source: 'Bloomberg',
      date: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      summary: `Several major investment banks raised their price targets on ${upperTicker} shares after the company unveiled its latest product lineup at a well-received investor event.`,
    },
    {
      id: '3',
      headline: `${upperTicker} Expands Partnership with Key Industry Players`,
      source: 'CNBC',
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      summary: `The tech giant announced an expanded strategic partnership that analysts say could unlock significant revenue opportunities in emerging markets over the next several years.`,
    },
    {
      id: '4',
      headline: `Market Watch: ${upperTicker} Stock Rises on Sector Momentum`,
      source: 'MarketWatch',
      date: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      summary: `Shares of ${upperTicker} gained ground as the broader sector rallied on optimistic economic data and expectations of continued growth in technology spending.`,
    },
    {
      id: '5',
      headline: `Institutional Investors Increase Stakes in ${upperTicker}`,
      source: 'Financial Times',
      date: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      summary: `New SEC filings reveal that major institutional investors have been accumulating shares of ${upperTicker}, signaling confidence in the company's long-term growth prospects.`,
    },
  ];
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return formatCurrency(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolume(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toLocaleString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return 'Just now';
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
