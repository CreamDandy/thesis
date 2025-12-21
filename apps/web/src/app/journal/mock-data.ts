import type { PositionWithThesis } from './types';

const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

const oneMonthAgo = new Date();
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

export const mockPositions: PositionWithThesis[] = [
  {
    id: '1',
    ticker: 'AAPL',
    companyName: 'Apple Inc.',
    shares: 50,
    avgCost: 175.5,
    currentPrice: 192.25,
    entryDate: '2024-03-15',
    targetPrice: 220,
    stopLoss: 160,
    expectedHold: '2yr',
    convictionLevel: 'high',
    thesis: {
      id: 't1',
      positionId: '1',
      content: 'Strong ecosystem moat with services growth acceleration',
      whyNow:
        'Services revenue is accelerating and the Vision Pro represents a new growth vector. iPhone install base continues to expand globally.',
      competitiveAdvantage:
        'Unmatched ecosystem integration across hardware, software, and services. Brand loyalty drives 90%+ retention rates.',
      keyRisks:
        'China regulatory risks, smartphone market saturation, competition in AR/VR space.',
      sellConditions:
        'Sell if services growth drops below 10% YoY for two consecutive quarters, or if China revenue declines more than 20%.',
      portfolioFit:
        'Core holding representing quality growth at reasonable valuation. Low correlation with other tech holdings due to hardware focus.',
      catalysts: [
        {
          id: 'c1',
          description: 'Vision Pro sales data release',
          expectedDate: '2025-01-30',
        },
        {
          id: 'c2',
          description: 'Services revenue update in Q1 earnings',
          expectedDate: '2025-02-01',
        },
      ],
      status: 'active',
      lastReviewedDate: twoWeeksAgo.toISOString(),
      reviews: [
        {
          id: 'r1',
          date: twoWeeksAgo.toISOString(),
          notes:
            'Thesis intact. Services growth remains strong at 14% YoY. Maintaining position.',
          actionTaken: 'No action',
        },
      ],
    },
  },
  {
    id: '2',
    ticker: 'MSFT',
    companyName: 'Microsoft Corporation',
    shares: 30,
    avgCost: 380.0,
    currentPrice: 415.5,
    entryDate: '2024-01-10',
    targetPrice: 480,
    stopLoss: 350,
    expectedHold: '5yr',
    convictionLevel: 'high',
    thesis: {
      id: 't2',
      positionId: '2',
      content: 'AI leader with Azure and Copilot monetization potential',
      whyNow:
        'AI integration across product suite creates multiple revenue streams. Azure growth remains robust.',
      competitiveAdvantage:
        'Enterprise relationships, GitHub/Copilot developer ecosystem, OpenAI partnership.',
      keyRisks:
        'Antitrust scrutiny, AI competition from Google/Amazon, slower enterprise spending.',
      sellConditions:
        'Exit if Azure growth falls below cloud peers for 3 quarters, or if Copilot adoption disappoints.',
      portfolioFit:
        'Anchor position in enterprise software. Provides stability with growth optionality.',
      catalysts: [
        {
          id: 'c3',
          description: 'Copilot enterprise adoption metrics',
          expectedDate: '2025-01-25',
        },
      ],
      status: 'needs-review',
      lastReviewedDate: sixMonthsAgo.toISOString(),
      reviews: [
        {
          id: 'r2',
          date: sixMonthsAgo.toISOString(),
          notes:
            'Strong quarter. Copilot showing early traction. Will reassess after next earnings.',
          actionTaken: 'Added 10 shares',
        },
      ],
    },
  },
  {
    id: '3',
    ticker: 'GOOGL',
    companyName: 'Alphabet Inc.',
    shares: 40,
    avgCost: 142.0,
    currentPrice: 168.75,
    entryDate: '2024-06-20',
    targetPrice: 200,
    stopLoss: 125,
    expectedHold: '2yr',
    convictionLevel: 'medium',
    thesis: {
      id: 't3',
      positionId: '3',
      content: 'Search dominance + undervalued cloud and AI assets',
      whyNow:
        'AI fears have created attractive entry point. Gemini showing promise, YouTube remains undermonetized.',
      competitiveAdvantage:
        'Search monopoly, YouTube scale, Waymo leadership in autonomous, TPU infrastructure.',
      keyRisks:
        'Antitrust cases, AI disruption to search, TikTok competition for attention.',
      sellConditions:
        'Sell if search market share drops below 85%, or if antitrust remedy materially impacts business model.',
      portfolioFit:
        'Underweight position with optionality on multiple AI vectors.',
      catalysts: [
        {
          id: 'c4',
          description: 'Gemini 2.0 launch and benchmarks',
          expectedDate: '2025-02-15',
        },
        {
          id: 'c5',
          description: 'DOJ antitrust ruling',
          expectedDate: '2025-03-01',
        },
      ],
      status: 'active',
      lastReviewedDate: oneMonthAgo.toISOString(),
      reviews: [
        {
          id: 'r3',
          date: oneMonthAgo.toISOString(),
          notes:
            'Gemini showing improvement. Maintaining medium conviction pending antitrust clarity.',
          actionTaken: 'No action',
        },
      ],
    },
  },
  {
    id: '4',
    ticker: 'NVDA',
    companyName: 'NVIDIA Corporation',
    shares: 25,
    avgCost: 145.0,
    currentPrice: 116.0,
    entryDate: '2024-08-01',
    targetPrice: 180,
    stopLoss: 100,
    expectedHold: '1yr',
    convictionLevel: 'medium',
    thesis: {
      id: 't4',
      positionId: '4',
      content: 'AI infrastructure leader with data center dominance',
      whyNow:
        'Blackwell architecture launch cycle beginning. AI capex continues to grow.',
      competitiveAdvantage:
        'CUDA ecosystem moat, 90%+ data center GPU share, software stack integration.',
      keyRisks:
        'Customer concentration, competition from AMD/custom silicon, valuation compression.',
      sellConditions:
        'Exit if data center growth decelerates below 30% YoY or if major customer announces in-house solution.',
      portfolioFit:
        'High-beta AI pure play. Position sized for volatility.',
      catalysts: [
        {
          id: 'c6',
          description: 'Blackwell production ramp update',
          expectedDate: '2025-02-20',
        },
      ],
      status: 'needs-review',
      lastReviewedDate: oneMonthAgo.toISOString(),
      reviews: [
        {
          id: 'r4',
          date: oneMonthAgo.toISOString(),
          notes:
            'Position down 20%. Need to reassess thesis given price action and Blackwell delays.',
          actionTaken: 'Reviewing position',
        },
      ],
    },
  },
  {
    id: '5',
    ticker: 'META',
    companyName: 'Meta Platforms Inc.',
    shares: 20,
    avgCost: 485.0,
    currentPrice: 580.25,
    entryDate: '2024-09-15',
    expectedHold: '2yr',
    convictionLevel: 'high',
    thesis: {
      id: 't5',
      positionId: '5',
      content: 'Social media dominance with AI-driven engagement improvements',
      whyNow:
        'Reels monetization closing gap with TikTok. AI recommendation driving engagement gains.',
      competitiveAdvantage:
        '3B+ daily active users, best-in-class ad targeting, Reality Labs optionality.',
      keyRisks:
        'Regulatory pressure, Reality Labs losses, competition for attention.',
      sellConditions:
        'Sell if DAU growth turns negative in developed markets or if Reality Labs losses exceed $20B annually.',
      portfolioFit:
        'Core advertising exposure. Provides balance to enterprise-focused positions.',
      catalysts: [
        {
          id: 'c7',
          description: 'Llama 4 release',
          expectedDate: '2025-03-01',
        },
        {
          id: 'c8',
          description: 'Ray-Ban Meta glasses V2 launch',
          expectedDate: '2025-04-15',
        },
      ],
      status: 'active',
      lastReviewedDate: twoWeeksAgo.toISOString(),
      reviews: [
        {
          id: 'r5',
          date: twoWeeksAgo.toISOString(),
          notes:
            'Strong performance. Thesis playing out well. Engagement metrics improving.',
          actionTaken: 'No action',
        },
      ],
    },
  },
];

export function getPositionById(id: string): PositionWithThesis | undefined {
  return mockPositions.find((p) => p.id === id);
}
