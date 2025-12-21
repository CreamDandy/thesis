'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PositionWithThesis, ThesisStatus, HoldPeriod } from './types';

interface ThesisViewProps {
  position: PositionWithThesis;
}

function getStatusBadgeStyle(status: ThesisStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-600 hover:bg-green-700';
    case 'needs-review':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'closed':
      return 'bg-gray-500 hover:bg-gray-600';
    default:
      return '';
  }
}

function getStatusLabel(status: ThesisStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'needs-review':
      return 'Needs Review';
    case 'closed':
      return 'Closed';
    default:
      return status;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function formatHoldPeriod(hold: HoldPeriod): string {
  const labels: Record<HoldPeriod, string> = {
    '6mo': '6 Months',
    '1yr': '1 Year',
    '2yr': '2 Years',
    '5yr': '5 Years',
    indefinite: 'Indefinite',
  };
  return labels[hold];
}

function ThesisSection({
  title,
  content,
  isEditing,
  onContentChange,
}: {
  title: string;
  content: string;
  isEditing: boolean;
  onContentChange?: (value: string) => void;
}) {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Label className="font-semibold">{title}</Label>
        <textarea
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          value={content}
          onChange={(e) => onContentChange?.(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  );
}

export function ThesisView({ position }: ThesisViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [editedThesis, setEditedThesis] = useState({
    whyNow: position.thesis?.whyNow || '',
    competitiveAdvantage: position.thesis?.competitiveAdvantage || '',
    keyRisks: position.thesis?.keyRisks || '',
    sellConditions: position.thesis?.sellConditions || '',
    portfolioFit: position.thesis?.portfolioFit || '',
  });

  const thesis = position.thesis;

  if (!thesis) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No thesis has been written for this position yet.
          </p>
          <Button onClick={() => router.push('/journal?tab=add')}>
            Write Thesis
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pl = {
    amount: (position.currentPrice - position.avgCost) * position.shares,
    percentage:
      ((position.currentPrice - position.avgCost) / position.avgCost) * 100,
  };
  const isProfit = pl.amount >= 0;

  const handleSaveEdit = () => {
    console.log('Saving edited thesis:', editedThesis);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedThesis({
      whyNow: thesis.whyNow,
      competitiveAdvantage: thesis.competitiveAdvantage,
      keyRisks: thesis.keyRisks,
      sellConditions: thesis.sellConditions,
      portfolioFit: thesis.portfolioFit,
    });
    setIsEditing(false);
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', reviewNotes);
    setShowReviewModal(false);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push('/journal')}>
        ← Back to Journal
      </Button>

      {/* Position Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                {position.ticker}
                <Badge className={getStatusBadgeStyle(thesis.status)}>
                  {getStatusLabel(thesis.status)}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {position.companyName}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button onClick={() => setShowReviewModal(true)}>
                    Review Thesis
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Entry Date</p>
              <p className="font-medium">{formatDate(position.entryDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shares</p>
              <p className="font-medium">{position.shares}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Cost</p>
              <p className="font-medium">{formatCurrency(position.avgCost)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current P/L</p>
              <p
                className={`font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}
              >
                {formatCurrency(pl.amount)} (
                {isProfit ? '+' : ''}
                {pl.percentage.toFixed(2)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hold Period</p>
              <p className="font-medium">
                {formatHoldPeriod(position.expectedHold)}
              </p>
            </div>
          </div>
          {(position.targetPrice || position.stopLoss) && (
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
              {position.targetPrice && (
                <div>
                  <p className="text-sm text-muted-foreground">Target Price</p>
                  <p className="font-medium text-green-600">
                    {formatCurrency(position.targetPrice)}
                  </p>
                </div>
              )}
              {position.stopLoss && (
                <div>
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="font-medium text-red-600">
                    {formatCurrency(position.stopLoss)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Conviction</p>
                <p className="font-medium capitalize">
                  {position.convictionLevel}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Reviewed</p>
                <p className="font-medium">
                  {formatDate(thesis.lastReviewedDate)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thesis Content */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Thesis</CardTitle>
          <CardDescription>
            Your documented reasoning for this investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ThesisSection
            title="Why are you buying this stock now?"
            content={isEditing ? editedThesis.whyNow : thesis.whyNow}
            isEditing={isEditing}
            onContentChange={(value) =>
              setEditedThesis((prev) => ({ ...prev, whyNow: value }))
            }
          />
          <ThesisSection
            title="Competitive Advantage"
            content={
              isEditing
                ? editedThesis.competitiveAdvantage
                : thesis.competitiveAdvantage
            }
            isEditing={isEditing}
            onContentChange={(value) =>
              setEditedThesis((prev) => ({
                ...prev,
                competitiveAdvantage: value,
              }))
            }
          />
          <ThesisSection
            title="Key Risks"
            content={isEditing ? editedThesis.keyRisks : thesis.keyRisks}
            isEditing={isEditing}
            onContentChange={(value) =>
              setEditedThesis((prev) => ({ ...prev, keyRisks: value }))
            }
          />
          <ThesisSection
            title="Sell Conditions"
            content={
              isEditing ? editedThesis.sellConditions : thesis.sellConditions
            }
            isEditing={isEditing}
            onContentChange={(value) =>
              setEditedThesis((prev) => ({ ...prev, sellConditions: value }))
            }
          />
          <ThesisSection
            title="Portfolio Fit"
            content={isEditing ? editedThesis.portfolioFit : thesis.portfolioFit}
            isEditing={isEditing}
            onContentChange={(value) =>
              setEditedThesis((prev) => ({ ...prev, portfolioFit: value }))
            }
          />
        </CardContent>
      </Card>

      {/* Catalysts */}
      {thesis.catalysts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Catalysts</CardTitle>
            <CardDescription>
              Events that could impact your thesis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {thesis.catalysts.map((catalyst) => (
                <div
                  key={catalyst.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <p className="font-medium">{catalyst.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(catalyst.expectedDate)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review History */}
      {thesis.reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Review History</CardTitle>
            <CardDescription>Past thesis reviews and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thesis.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-l-2 border-muted pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium">
                      {formatDate(review.date)}
                    </p>
                    {review.actionTaken && (
                      <Badge variant="outline">{review.actionTaken}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <CardTitle>Review Thesis</CardTitle>
              <CardDescription>
                Record your periodic review of this investment thesis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewNotes">Review Notes</Label>
                <textarea
                  id="reviewNotes"
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                  placeholder="Has anything changed about your thesis? Are the key assumptions still valid?"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={!reviewNotes.trim()}
                >
                  Submit Review
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
