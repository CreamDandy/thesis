import { PortfolioSummary } from './portfolio-summary';
import { PositionsList } from './positions-list';
import { ThesisReminders } from './thesis-reminders';
import { WatchlistPreview } from './watchlist-preview';
import { RecentActivity } from './recent-activity';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-6">
        {/* Portfolio Summary - Full Width */}
        <PortfolioSummary />

        {/* Main Grid - 2 columns on desktop */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Positions List */}
          <div className="md:col-span-2">
            <PositionsList />
          </div>

          {/* Thesis Reminders */}
          <ThesisReminders />

          {/* Watchlist Preview */}
          <WatchlistPreview />

          {/* Recent Activity - Full Width */}
          <div className="md:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
