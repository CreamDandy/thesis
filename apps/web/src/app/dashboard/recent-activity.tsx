'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  type: 'watchlist' | 'thesis' | 'report' | 'trade';
}

const activities: Activity[] = [
  {
    id: '1',
    action: 'Added NVDA to watchlist',
    timestamp: '2 hours ago',
    type: 'watchlist',
  },
  {
    id: '2',
    action: 'Updated thesis for AAPL',
    timestamp: '1 day ago',
    type: 'thesis',
  },
  {
    id: '3',
    action: 'Generated report for MSFT',
    timestamp: '3 days ago',
    type: 'report',
  },
  {
    id: '4',
    action: 'Added 10 shares of GOOGL',
    timestamp: '5 days ago',
    type: 'trade',
  },
  {
    id: '5',
    action: 'Removed META from watchlist',
    timestamp: '1 week ago',
    type: 'watchlist',
  },
];

function getActivityIcon(type: Activity['type']): string {
  switch (type) {
    case 'watchlist':
      return 'eye';
    case 'thesis':
      return 'edit';
    case 'report':
      return 'file';
    case 'trade':
      return 'dollar';
    default:
      return 'activity';
  }
}

function getActivityStyles(type: Activity['type']): string {
  switch (type) {
    case 'watchlist':
      return 'bg-blue-100 text-blue-600';
    case 'thesis':
      return 'bg-purple-100 text-purple-600';
    case 'report':
      return 'bg-green-100 text-green-600';
    case 'trade':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

export function RecentActivity() {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              No recent activity.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your recent actions will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityStyles(
                  activity.type
                )}`}
              >
                <ActivityIcon type={activity.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityIcon({ type }: { type: Activity['type'] }) {
  switch (type) {
    case 'watchlist':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'thesis':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      );
    case 'report':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </svg>
      );
    case 'trade':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    default:
      return null;
  }
}
