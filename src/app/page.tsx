'use client';

import { useMarketUpdates } from '@/hooks/useMarketUpdates';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TradingViewChart } from '@/components/chart/TradingViewChart';
import { MoneyMaps } from '@/components/moneymap/MoneyMaps';
import { DetailsPanel } from '@/components/details/DetailsPanel';
import { WatchlistPanel } from '@/components/watchlist/WatchlistPanel';
import { ManagingPanel } from '@/components/manage/ManagingPanel';
import { StockScreener } from '@/components/screener/StockScreener';

export default function Home() {
  // Start all data engines and keyboard shortcuts
  useMarketUpdates();
  useKeyboardShortcuts();

  return (
    <DashboardLayout
      onionChart={<TradingViewChart />}
      moneyMaps={<MoneyMaps />}
      stockScreener={<StockScreener />}
      detailsPanel={<DetailsPanel />}
      watchlistPanel={<WatchlistPanel />}
      managingPanel={<ManagingPanel />}
    />
  );
}
