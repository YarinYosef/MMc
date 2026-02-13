'use client';

import { useMarketUpdates } from '@/hooks/useMarketUpdates';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CompassBar } from '@/components/compass/CompassBar';
import { OnionChart } from '@/components/onion/OnionChart';
import { MoneyMaps } from '@/components/moneymap/MoneyMaps';
import { DetailsPanel } from '@/components/details/DetailsPanel';
import { NewsFeed } from '@/components/news/NewsFeed';
import { WatchlistPanel } from '@/components/watchlist/WatchlistPanel';
import { ManagingPanel } from '@/components/manage/ManagingPanel';

export default function Home() {
  // Start all data engines and keyboard shortcuts
  useMarketUpdates();
  useKeyboardShortcuts();

  return (
    <DashboardLayout
      compassBar={<CompassBar />}
      onionChart={<OnionChart />}
      moneyMaps={<MoneyMaps />}
      detailsPanel={<DetailsPanel />}
      newsFeed={<NewsFeed />}
      watchlistPanel={<WatchlistPanel />}
      managingPanel={<ManagingPanel />}
    />
  );
}
