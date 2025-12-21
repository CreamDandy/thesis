export type ConvictionLevel = 'high' | 'medium' | 'low';
export type HoldPeriod = '6mo' | '1yr' | '2yr' | '5yr' | 'indefinite';
export type ThesisStatus = 'active' | 'needs-review' | 'closed';

export interface Position {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  entryDate: string;
  targetPrice?: number;
  stopLoss?: number;
  expectedHold: HoldPeriod;
  convictionLevel: ConvictionLevel;
}

export interface Catalyst {
  id: string;
  description: string;
  expectedDate: string;
}

export interface ThesisReview {
  id: string;
  date: string;
  notes: string;
  actionTaken?: string;
}

export interface Thesis {
  id: string;
  positionId: string;
  content: string;
  whyNow: string;
  competitiveAdvantage: string;
  keyRisks: string;
  sellConditions: string;
  portfolioFit: string;
  catalysts: Catalyst[];
  status: ThesisStatus;
  lastReviewedDate: string;
  reviews: ThesisReview[];
}

export interface PositionWithThesis extends Position {
  thesis?: Thesis;
}
