'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, type NewsItem } from '@/lib/mock-stock-data';

interface NewsTabProps {
  ticker: string;
  news: NewsItem[];
}

interface NewsCardProps {
  item: NewsItem;
}

function NewsCard({ item }: NewsCardProps) {
  return (
    <div className="border-b last:border-b-0 py-4 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h3 className="font-medium leading-snug hover:text-primary cursor-pointer transition-colors">
            {item.headline}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{item.source}</span>
            <span>•</span>
            <span>{formatDate(item.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsTab({ ticker, news }: NewsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>Recent news and updates for {ticker}</CardDescription>
        </CardHeader>
        <CardContent>
          {news.length > 0 ? (
            <div className="divide-y">
              {news.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No recent news available for {ticker}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => {
            // Placeholder - will load more news
            console.log('Load more news for:', ticker);
          }}
        >
          Load More News
        </Button>
      </div>
    </div>
  );
}
