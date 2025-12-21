'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThesisForm } from './thesis-form';
import type { ConvictionLevel, HoldPeriod } from './types';

interface PositionFormData {
  ticker: string;
  shares: string;
  avgCost: string;
  entryDate: string;
  targetPrice: string;
  stopLoss: string;
  expectedHold: HoldPeriod | '';
  convictionLevel: ConvictionLevel | '';
}

interface FormErrors {
  ticker?: string;
  shares?: string;
  avgCost?: string;
  entryDate?: string;
  expectedHold?: string;
  convictionLevel?: string;
}

const initialFormData: PositionFormData = {
  ticker: '',
  shares: '',
  avgCost: '',
  entryDate: '',
  targetPrice: '',
  stopLoss: '',
  expectedHold: '',
  convictionLevel: '',
};

export function AddPositionTab() {
  const [formData, setFormData] = useState<PositionFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showThesisForm, setShowThesisForm] = useState(false);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ticker.trim()) {
      newErrors.ticker = 'Ticker is required';
    } else if (!/^[A-Z]{1,5}$/.test(formData.ticker.toUpperCase())) {
      newErrors.ticker = 'Enter a valid ticker (1-5 letters)';
    }

    if (!formData.shares) {
      newErrors.shares = 'Number of shares is required';
    } else if (Number(formData.shares) <= 0) {
      newErrors.shares = 'Shares must be greater than 0';
    }

    if (!formData.avgCost) {
      newErrors.avgCost = 'Average cost is required';
    } else if (Number(formData.avgCost) <= 0) {
      newErrors.avgCost = 'Average cost must be greater than 0';
    }

    if (!formData.entryDate) {
      newErrors.entryDate = 'Entry date is required';
    }

    if (!formData.expectedHold) {
      newErrors.expectedHold = 'Expected hold period is required';
    }

    if (!formData.convictionLevel) {
      newErrors.convictionLevel = 'Conviction level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (field: keyof PositionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      setShowThesisForm(true);
    }
  };

  const handleBack = () => {
    setShowThesisForm(false);
  };

  const handleSaveComplete = () => {
    // Reset form and go back to position entry
    setFormData(initialFormData);
    setShowThesisForm(false);
    // In a real app, this would redirect to the positions list or the new position's page
  };

  if (showThesisForm) {
    return (
      <ThesisForm
        positionData={{
          ticker: formData.ticker.toUpperCase(),
          shares: Number(formData.shares),
          avgCost: Number(formData.avgCost),
          entryDate: formData.entryDate,
          targetPrice: formData.targetPrice
            ? Number(formData.targetPrice)
            : undefined,
          stopLoss: formData.stopLoss ? Number(formData.stopLoss) : undefined,
          expectedHold: formData.expectedHold as HoldPeriod,
          convictionLevel: formData.convictionLevel as ConvictionLevel,
        }}
        onBack={handleBack}
        onSave={handleSaveComplete}
      />
    );
  }

  const isFormValid =
    formData.ticker.trim() &&
    formData.shares &&
    Number(formData.shares) > 0 &&
    formData.avgCost &&
    Number(formData.avgCost) > 0 &&
    formData.entryDate &&
    formData.expectedHold &&
    formData.convictionLevel;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Position</CardTitle>
        <CardDescription>
          Enter the details of your new investment position
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Ticker */}
          <div className="space-y-2">
            <Label htmlFor="ticker">
              Ticker <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ticker"
              placeholder="e.g., AAPL"
              value={formData.ticker}
              onChange={(e) =>
                handleInputChange('ticker', e.target.value.toUpperCase())
              }
              className={errors.ticker ? 'border-red-500' : ''}
            />
            {errors.ticker && (
              <p className="text-sm text-red-500">{errors.ticker}</p>
            )}
          </div>

          {/* Shares */}
          <div className="space-y-2">
            <Label htmlFor="shares">
              Shares <span className="text-red-500">*</span>
            </Label>
            <Input
              id="shares"
              type="number"
              placeholder="100"
              min="0"
              step="0.01"
              value={formData.shares}
              onChange={(e) => handleInputChange('shares', e.target.value)}
              className={errors.shares ? 'border-red-500' : ''}
            />
            {errors.shares && (
              <p className="text-sm text-red-500">{errors.shares}</p>
            )}
          </div>

          {/* Average Cost */}
          <div className="space-y-2">
            <Label htmlFor="avgCost">
              Average Cost ($) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="avgCost"
              type="number"
              placeholder="150.00"
              min="0"
              step="0.01"
              value={formData.avgCost}
              onChange={(e) => handleInputChange('avgCost', e.target.value)}
              className={errors.avgCost ? 'border-red-500' : ''}
            />
            {errors.avgCost && (
              <p className="text-sm text-red-500">{errors.avgCost}</p>
            )}
          </div>

          {/* Entry Date */}
          <div className="space-y-2">
            <Label htmlFor="entryDate">
              Entry Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="entryDate"
              type="date"
              value={formData.entryDate}
              onChange={(e) => handleInputChange('entryDate', e.target.value)}
              className={errors.entryDate ? 'border-red-500' : ''}
            />
            {errors.entryDate && (
              <p className="text-sm text-red-500">{errors.entryDate}</p>
            )}
          </div>

          {/* Target Price (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="targetPrice">Target Price ($)</Label>
            <Input
              id="targetPrice"
              type="number"
              placeholder="200.00"
              min="0"
              step="0.01"
              value={formData.targetPrice}
              onChange={(e) => handleInputChange('targetPrice', e.target.value)}
            />
          </div>

          {/* Stop Loss (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="stopLoss">Stop Loss ($)</Label>
            <Input
              id="stopLoss"
              type="number"
              placeholder="120.00"
              min="0"
              step="0.01"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange('stopLoss', e.target.value)}
            />
          </div>

          {/* Expected Hold Period */}
          <div className="space-y-2">
            <Label htmlFor="expectedHold">
              Expected Hold Period <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.expectedHold}
              onValueChange={(value) =>
                handleInputChange('expectedHold', value)
              }
            >
              <SelectTrigger
                id="expectedHold"
                className={errors.expectedHold ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select hold period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6mo">6 Months</SelectItem>
                <SelectItem value="1yr">1 Year</SelectItem>
                <SelectItem value="2yr">2 Years</SelectItem>
                <SelectItem value="5yr">5 Years</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
            {errors.expectedHold && (
              <p className="text-sm text-red-500">{errors.expectedHold}</p>
            )}
          </div>

          {/* Conviction Level */}
          <div className="space-y-2">
            <Label htmlFor="convictionLevel">
              Conviction Level <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.convictionLevel}
              onValueChange={(value) =>
                handleInputChange('convictionLevel', value)
              }
            >
              <SelectTrigger
                id="convictionLevel"
                className={errors.convictionLevel ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select conviction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            {errors.convictionLevel && (
              <p className="text-sm text-red-500">{errors.convictionLevel}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleContinue} disabled={!isFormValid}>
            Continue to Thesis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
