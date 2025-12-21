'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConvictionLevel, HoldPeriod, Catalyst } from './types';

interface PositionData {
  ticker: string;
  shares: number;
  avgCost: number;
  entryDate: string;
  targetPrice?: number;
  stopLoss?: number;
  expectedHold: HoldPeriod;
  convictionLevel: ConvictionLevel;
}

interface ThesisFormProps {
  positionData: PositionData;
  onBack: () => void;
  onSave: () => void;
}

interface ThesisData {
  whyNow: string;
  competitiveAdvantage: string;
  keyRisks: string;
  sellConditions: string;
  portfolioFit: string;
}

const MAX_CHARS = 1000;

function TextAreaWithCount({
  id,
  label,
  placeholder,
  value,
  onChange,
  maxChars = MAX_CHARS,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxChars?: number;
}) {
  const charCount = value.length;
  const isNearLimit = charCount > maxChars * 0.9;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <textarea
          id={id}
          className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span
          className={`absolute bottom-2 right-2 text-xs ${
            isOverLimit
              ? 'text-red-500'
              : isNearLimit
                ? 'text-yellow-500'
                : 'text-muted-foreground'
          }`}
        >
          {charCount}/{maxChars}
        </span>
      </div>
    </div>
  );
}

export function ThesisForm({ positionData, onBack, onSave }: ThesisFormProps) {
  const [thesisData, setThesisData] = useState<ThesisData>({
    whyNow: '',
    competitiveAdvantage: '',
    keyRisks: '',
    sellConditions: '',
    portfolioFit: '',
  });
  const [catalysts, setCatalysts] = useState<Catalyst[]>([]);
  const [newCatalyst, setNewCatalyst] = useState({
    description: '',
    expectedDate: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleThesisChange = (field: keyof ThesisData, value: string) => {
    setThesisData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCatalyst = () => {
    if (newCatalyst.description.trim() && newCatalyst.expectedDate) {
      setCatalysts((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          description: newCatalyst.description.trim(),
          expectedDate: newCatalyst.expectedDate,
        },
      ]);
      setNewCatalyst({ description: '', expectedDate: '' });
    }
  };

  const handleRemoveCatalyst = (id: string) => {
    setCatalysts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Saving position:', positionData);
    console.log('Saving thesis:', thesisData);
    console.log('Saving catalysts:', catalysts);
    setIsSaving(false);
    onSave();
  };

  const isFormValid =
    thesisData.whyNow.trim() &&
    thesisData.competitiveAdvantage.trim() &&
    thesisData.keyRisks.trim() &&
    thesisData.sellConditions.trim();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);

  const formatHoldPeriod = (hold: HoldPeriod) => {
    const labels: Record<HoldPeriod, string> = {
      '6mo': '6 Months',
      '1yr': '1 Year',
      '2yr': '2 Years',
      '5yr': '5 Years',
      indefinite: 'Indefinite',
    };
    return labels[hold];
  };

  return (
    <div className="space-y-6">
      {/* Position Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{positionData.ticker}</CardTitle>
              <CardDescription>Position Details</CardDescription>
            </div>
            <Button variant="outline" onClick={onBack}>
              Back to Position
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Shares:</span>{' '}
              <span className="font-medium">{positionData.shares}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Cost:</span>{' '}
              <span className="font-medium">
                {formatCurrency(positionData.avgCost)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Hold Period:</span>{' '}
              <span className="font-medium">
                {formatHoldPeriod(positionData.expectedHold)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Conviction:</span>{' '}
              <span className="font-medium capitalize">
                {positionData.convictionLevel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thesis Form */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Thesis</CardTitle>
          <CardDescription>
            Document your reasoning for this investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextAreaWithCount
            id="whyNow"
            label="Why are you buying this stock now?"
            placeholder="Describe the timing of your investment decision. What makes now the right time to buy? Are there any catalysts or market conditions that influenced your timing?"
            value={thesisData.whyNow}
            onChange={(value) => handleThesisChange('whyNow', value)}
          />

          <TextAreaWithCount
            id="competitiveAdvantage"
            label="What is the company's competitive advantage?"
            placeholder="Describe the company's moat. What makes it difficult for competitors to replicate their success? Consider brand, network effects, switching costs, scale, or intellectual property."
            value={thesisData.competitiveAdvantage}
            onChange={(value) =>
              handleThesisChange('competitiveAdvantage', value)
            }
          />

          <TextAreaWithCount
            id="keyRisks"
            label="What are the key risks?"
            placeholder="Identify the main risks to your thesis. Consider competitive threats, regulatory risks, execution risks, valuation risks, and macroeconomic factors."
            value={thesisData.keyRisks}
            onChange={(value) => handleThesisChange('keyRisks', value)}
          />

          <TextAreaWithCount
            id="sellConditions"
            label="Under what conditions would you sell?"
            placeholder="Define specific criteria that would trigger a sale. Be as concrete as possible - include specific metrics, price targets, or events that would cause you to exit the position."
            value={thesisData.sellConditions}
            onChange={(value) => handleThesisChange('sellConditions', value)}
          />

          <TextAreaWithCount
            id="portfolioFit"
            label="How does this fit your portfolio?"
            placeholder="Explain how this position fits within your overall portfolio strategy. Consider diversification, correlation with other holdings, and position sizing rationale."
            value={thesisData.portfolioFit}
            onChange={(value) => handleThesisChange('portfolioFit', value)}
          />
        </CardContent>
      </Card>

      {/* Catalysts */}
      <Card>
        <CardHeader>
          <CardTitle>Catalysts</CardTitle>
          <CardDescription>
            Track upcoming events that could impact your thesis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Catalyst Form */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="catalystDesc">Catalyst Description</Label>
              <Input
                id="catalystDesc"
                placeholder="e.g., Q4 Earnings Report"
                value={newCatalyst.description}
                onChange={(e) =>
                  setNewCatalyst((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="w-full md:w-48 space-y-2">
              <Label htmlFor="catalystDate">Expected Date</Label>
              <Input
                id="catalystDate"
                type="date"
                value={newCatalyst.expectedDate}
                onChange={(e) =>
                  setNewCatalyst((prev) => ({
                    ...prev,
                    expectedDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddCatalyst}
                disabled={
                  !newCatalyst.description.trim() || !newCatalyst.expectedDate
                }
              >
                Add Catalyst
              </Button>
            </div>
          </div>

          {/* Catalysts List */}
          {catalysts.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              {catalysts.map((catalyst) => (
                <div
                  key={catalyst.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{catalyst.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Expected:{' '}
                      {new Date(catalyst.expectedDate).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCatalyst(catalyst.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {catalysts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No catalysts added yet. Add upcoming events that could impact your
              thesis.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSave} disabled={!isFormValid || isSaving}>
          {isSaving ? 'Saving...' : 'Save Thesis'}
        </Button>
      </div>
    </div>
  );
}
