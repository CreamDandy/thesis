'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { StockData } from '@/lib/mock-stock-data';

interface ReportTabProps {
  stock: StockData;
}

interface ReportSectionPreviewProps {
  title: string;
  description: string;
}

function ReportSectionPreview({ title, description }: ReportSectionPreviewProps) {
  return (
    <div className="border-l-2 border-muted pl-4 py-2">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function ReportTab({ stock }: ReportTabProps) {
  return (
    <div className="space-y-6">
      {/* Report Status */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Report</CardTitle>
          <CardDescription>
            Comprehensive analysis of {stock.name} ({stock.ticker})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Report Not Yet Generated</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Generate a comprehensive AI-powered research report for {stock.ticker} including
              valuation analysis, growth prospects, and investment recommendations.
            </p>
            <Button
              disabled
              size="lg"
              onClick={() => {
                // Placeholder - will be implemented with AI report generation
                console.log('Generate report for:', stock.ticker);
              }}
            >
              Generate Report
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Coming soon - AI report generation is under development
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expected Report Sections Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>
            The generated report will include the following sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReportSectionPreview
            title="Executive Summary"
            description="High-level overview of the investment thesis, key metrics, and overall recommendation."
          />
          <ReportSectionPreview
            title="Bull Case / Bear Case"
            description="Detailed analysis of potential upside catalysts and downside risks to consider."
          />
          <ReportSectionPreview
            title="Valuation Assessment"
            description="Comprehensive valuation using multiple methodologies including DCF, comparables, and historical analysis."
          />
          <ReportSectionPreview
            title="Key Catalysts"
            description="Upcoming events, product launches, and market factors that could impact the stock price."
          />
          <ReportSectionPreview
            title="Financial Analysis"
            description="Deep dive into revenue trends, profitability, balance sheet strength, and cash flow generation."
          />
          <ReportSectionPreview
            title="Competitive Positioning"
            description="Analysis of the company's market position, competitive advantages, and industry dynamics."
          />
        </CardContent>
      </Card>
    </div>
  );
}
