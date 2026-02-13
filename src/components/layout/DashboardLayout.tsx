'use client';

import { type ReactNode, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useNewsStore } from '@/stores/useNewsStore';
import { LayoutManager } from './LayoutManager';
import { LayoutManagerPanel } from './LayoutManagerPanel';
import { RatingOverlay } from './RatingOverlay';
import { WindowManager } from './WindowManager';
import { NotificationToastBridge } from '@/components/watchlist/NotificationToastBridge';

interface DashboardLayoutProps {
  compassBar: ReactNode;
  onionChart: ReactNode;
  moneyMaps: ReactNode;
  detailsPanel: ReactNode;
  newsFeed: ReactNode;
  watchlistPanel: ReactNode;
  managingPanel: ReactNode;
}

export function DashboardLayout({
  compassBar,
  onionChart,
  moneyMaps,
  detailsPanel,
  newsFeed,
  watchlistPanel,
  managingPanel,
}: DashboardLayoutProps) {
  const newsHeight = useLayoutStore((s) => {
    const layout = s.savedLayouts.find((l) => l.id === s.currentLayoutId);
    return layout?.newsHeightPercent ?? 8;
  });
  const watchlistOpen = useWatchlistStore((s) => s.isOpen);
  const toggleWatchlist = useWatchlistStore((s) => s.toggleOpen);
  const managingOpen = useLayoutStore((s) => s.managingPane.isOpen);
  const isWidgetVisible = useLayoutStore((s) => s.isWidgetVisible);

  const [isResizingNews, setIsResizingNews] = useState(false);
  const [currentNewsHeight, setCurrentNewsHeight] = useState(newsHeight);

  // Sync local state when the store's newsHeight changes (e.g., layout switch)
  useEffect(() => {
    setCurrentNewsHeight(newsHeight);
  }, [newsHeight]);

  const handleNewsResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizingNews(true);

      const startY = e.clientY;
      const startHeight = currentNewsHeight;
      const windowHeight = window.innerHeight;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = startY - moveEvent.clientY;
        const deltaPercent = (deltaY / windowHeight) * 100;
        const newHeight = Math.max(8, Math.min(15, startHeight + deltaPercent));
        setCurrentNewsHeight(newHeight);
      };

      const onMouseUp = () => {
        setIsResizingNews(false);
        // Persist the new height to the news store
        useNewsStore.getState().setHeightPercent(currentNewsHeight);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [currentNewsHeight]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      <WindowManager />
      <LayoutManagerPanel />
      <RatingOverlay />
      <NotificationToastBridge />

      {/* Top bar with layout controls */}
      <header className="h-8 flex items-center justify-between px-3 bg-slate-900 border-b border-slate-800 shrink-0">
        <span className="text-xs font-bold text-blue-400 tracking-wider">MMC DASHBOARD</span>
        <LayoutManager />
      </header>

      {/* Compass Bar */}
      {isWidgetVisible('compass') && (
        <div className="shrink-0 border-b border-slate-800">{compassBar}</div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Watchlist hamburger toggle (left side) */}
        <button
          onClick={toggleWatchlist}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-30',
            'w-5 h-10 flex flex-col items-center justify-center gap-0.5',
            'bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-r-md transition-all',
            watchlistOpen && 'left-64'
          )}
          title={watchlistOpen ? 'Close watchlist' : 'Open watchlist'}
        >
          <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
          <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
          <span className="w-2.5 h-0.5 bg-slate-400 rounded-full" />
        </button>

        {/* Watchlist Sidebar */}
        <div
          className={cn(
            'shrink-0 border-r border-slate-800 transition-all duration-300 overflow-hidden',
            watchlistOpen ? 'w-64' : 'w-0'
          )}
        >
          {watchlistPanel}
        </div>

        {/* Center + Right Layout */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Center Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Onion + Money Maps (center-left) */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <div className="flex-1 flex overflow-hidden">
                {isWidgetVisible('onion') && (
                  <div className="flex-1 overflow-hidden p-2">{onionChart}</div>
                )}
                {isWidgetVisible('moneymap') && (
                  <div className="flex-1 overflow-hidden p-2">{moneyMaps}</div>
                )}
              </div>
            </div>

            {/* Details Panel (right) */}
            {isWidgetVisible('details') && (
              <div className="w-80 shrink-0 border-l border-slate-800 overflow-hidden">
                {detailsPanel}
              </div>
            )}
          </div>

          {/* News Feed (bottom, resizable) */}
          {isWidgetVisible('news') && (
            <div className="shrink-0" style={{ height: `${currentNewsHeight}vh` }}>
              {/* Resize handle */}
              <div
                className={cn(
                  'h-1 cursor-row-resize hover:bg-blue-500/50 transition-colors',
                  isResizingNews ? 'bg-blue-500/50' : 'bg-slate-800'
                )}
                onMouseDown={handleNewsResize}
              />
              <div className="h-[calc(100%-4px)] overflow-hidden">{newsFeed}</div>
            </div>
          )}
        </div>
      </div>

      {/* Managing Panel Overlay */}
      {managingOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-[600px] max-h-[80vh] overflow-hidden">{managingPanel}</div>
        </div>
      )}
    </div>
  );
}
