import OpenAI from 'openai';
import { z } from 'zod';
import { SYSTEM_PROMPT, buildStockReportPrompt, StockReportInput } from './prompts/stock-report.js';

// =============================================================================
// Report Schema
// =============================================================================

const GeneratedReportSchema = z.object({
  executiveSummary: z.string(),
  bullCase: z.array(z.string()).min(3).max(5),
  bearCase: z.array(z.string()).min(3).max(5),
  valuationAssessment: z.string(),
  valuationVerdict: z.enum(['undervalued', 'fairly_valued', 'overvalued']),
  keyMetrics: z.array(z.object({
    name: z.string(),
    value: z.string(),
    explanation: z.string(),
  })).min(5).max(7),
  recentDevelopments: z.array(z.object({
    date: z.string(),
    headline: z.string(),
    summary: z.string(),
  })).optional(),
  catalystCalendar: z.array(z.object({
    date: z.string(),
    event: z.string(),
    type: z.enum(['earnings', 'dividend', 'product', 'regulatory', 'other']),
  })).optional(),
});

export type GeneratedReport = z.infer<typeof GeneratedReportSchema>;

// =============================================================================
// Report Generator
// =============================================================================

export interface ReportGeneratorConfig {
  openaiApiKey: string;
  perplexityApiKey?: string;
  model?: string;
  maxRetries?: number;
}

export class ReportGenerator {
  private readonly openai: OpenAI;
  private readonly perplexity?: OpenAI;
  private readonly model: string;
  private readonly maxRetries: number;

  constructor(config: ReportGeneratorConfig) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    if (config.perplexityApiKey) {
      this.perplexity = new OpenAI({
        apiKey: config.perplexityApiKey,
        baseURL: 'https://api.perplexity.ai',
      });
    }

    this.model = config.model ?? 'gpt-4o';
    this.maxRetries = config.maxRetries ?? 3;
  }

  /**
   * Generate a stock report using AI
   */
  async generateReport(input: StockReportInput): Promise<GeneratedReport> {
    const prompt = buildStockReportPrompt(input);

    let lastError: Error | undefined;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 4000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('No content in response');
        }

        const parsed = JSON.parse(content);
        const validated = GeneratedReportSchema.parse(parsed);

        return validated;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Report generation attempt ${attempt + 1} failed:`, lastError.message);

        if (attempt < this.maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError ?? new Error('Report generation failed');
  }

  /**
   * Research a stock using Perplexity for real-time information
   */
  async researchStock(ticker: string, companyName: string): Promise<string> {
    if (!this.perplexity) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await this.perplexity.chat.completions.create({
      model: 'sonar-pro',
      messages: [
        {
          role: 'system',
          content: 'You are a financial research assistant. Provide factual, well-sourced information about stocks.',
        },
        {
          role: 'user',
          content: `Research ${ticker} (${companyName}). Focus on:
1. Most recent earnings results and any guidance changes
2. Major news from the last 30 days
3. Recent analyst rating changes
4. Upcoming catalysts (earnings date, product launches, etc.)
5. Key competitive developments

Be specific with dates, numbers, and sources.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content ?? '';
  }

  /**
   * Generate a complete report with research
   */
  async generateReportWithResearch(input: StockReportInput): Promise<{
    report: GeneratedReport;
    research: string;
    generationTimeMs: number;
  }> {
    const startTime = Date.now();

    // Run research in parallel if Perplexity is configured
    let research = '';
    if (this.perplexity) {
      try {
        research = await this.researchStock(input.ticker, input.companyName);
        // Add research to recent news for context
        input.recentNews = [
          ...input.recentNews,
          `[AI Research Summary]: ${research.slice(0, 500)}...`,
        ];
      } catch (error) {
        console.error('Research failed, continuing without:', error);
      }
    }

    const report = await this.generateReport(input);
    const generationTimeMs = Date.now() - startTime;

    return {
      report,
      research,
      generationTimeMs,
    };
  }
}

// =============================================================================
// Quality Scoring
// =============================================================================

export interface QualityScore {
  overall: number; // 0-100
  completeness: number;
  specificity: number;
  balance: number;
  issues: string[];
}

/**
 * Score the quality of a generated report
 */
export function scoreReportQuality(report: GeneratedReport): QualityScore {
  const issues: string[] = [];
  let completeness = 100;
  let specificity = 100;
  let balance = 100;

  // Check completeness
  if (!report.executiveSummary || report.executiveSummary.length < 100) {
    completeness -= 20;
    issues.push('Executive summary is too short');
  }

  if (report.bullCase.length < 3) {
    completeness -= 15;
    issues.push('Bull case has fewer than 3 points');
  }

  if (report.bearCase.length < 3) {
    completeness -= 15;
    issues.push('Bear case has fewer than 3 points');
  }

  if (!report.valuationAssessment || report.valuationAssessment.length < 200) {
    completeness -= 20;
    issues.push('Valuation assessment is too short');
  }

  if (report.keyMetrics.length < 5) {
    completeness -= 10;
    issues.push('Fewer than 5 key metrics');
  }

  // Check specificity (look for numbers and dates)
  const hasNumbers = /\d+(\.\d+)?%|\$\d+|\d+x/;
  
  for (const point of report.bullCase) {
    if (!hasNumbers.test(point)) {
      specificity -= 5;
    }
  }

  for (const point of report.bearCase) {
    if (!hasNumbers.test(point)) {
      specificity -= 5;
    }
  }

  if (!hasNumbers.test(report.valuationAssessment)) {
    specificity -= 20;
    issues.push('Valuation assessment lacks specific numbers');
  }

  // Check balance
  const bullLength = report.bullCase.join(' ').length;
  const bearLength = report.bearCase.join(' ').length;
  const ratio = Math.min(bullLength, bearLength) / Math.max(bullLength, bearLength);

  if (ratio < 0.5) {
    balance -= 30;
    issues.push('Bull and bear cases are significantly unbalanced');
  } else if (ratio < 0.7) {
    balance -= 15;
    issues.push('Bull and bear cases could be more balanced');
  }

  // Calculate overall score
  const overall = Math.round(
    (completeness * 0.4 + specificity * 0.35 + balance * 0.25)
  );

  return {
    overall: Math.max(0, Math.min(100, overall)),
    completeness: Math.max(0, Math.min(100, completeness)),
    specificity: Math.max(0, Math.min(100, specificity)),
    balance: Math.max(0, Math.min(100, balance)),
    issues,
  };
}
