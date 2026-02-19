'use client';

import { type ReactNode, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { LayoutManagerPanel } from './LayoutManagerPanel';
import { RatingOverlay } from './RatingOverlay';
import { WindowManager } from './WindowManager';
import { NotificationToastBridge } from '@/components/watchlist/NotificationToastBridge';
import { AssetInfoBar } from './AssetInfoBar';
import { StockChatInput } from '@/components/chat/StockChatInput';

interface DashboardLayoutProps {
  onionChart: ReactNode;
  moneyMaps: ReactNode;
  stockScreener: ReactNode;
  detailsPanel: ReactNode;
  watchlistPanel: ReactNode;
  managingPanel: ReactNode;
}

export function DashboardLayout({
  onionChart,
  moneyMaps,
  stockScreener,
  detailsPanel,
  watchlistPanel,
  managingPanel,
}: DashboardLayoutProps) {
  // Subscribe to the actual layout data so we re-render on changes
  const savedLayouts = useLayoutStore((s) => s.savedLayouts);
  const currentLayoutId = useLayoutStore((s) => s.currentLayoutId);

  const currentLayout = useMemo(
    () => savedLayouts.find((l) => l.id === currentLayoutId),
    [savedLayouts, currentLayoutId]
  );

  const isWidgetVisible = useCallback(
    (widgetType: string) => {
      if (!currentLayout) return true;
      const widget = currentLayout.widgets.find((w) => w.type === widgetType);
      return widget?.visible ?? true;
    },
    [currentLayout]
  );

  const onionMoneyMapSplit = currentLayout?.onionMoneyMapSplit ?? 65;

  const watchlistOpen = useWatchlistStore((s) => s.isOpen);
  const watchlistDetached = useWatchlistStore((s) => s.isDetached);
  const toggleWatchlist = useWatchlistStore((s) => s.toggleOpen);
  const managingOpen = useLayoutStore((s) => s.managingPane.isOpen);

  const loadLayouts = useLayoutStore((s) => s.loadLayouts);

  // Load persisted layouts from localStorage on mount
  useEffect(() => {
    loadLayouts();
  }, [loadLayouts]);

  // Onion / MoneyMap vertical split state
  const [isResizingSplit, setIsResizingSplit] = useState(false);
  const [currentSplit, setCurrentSplit] = useState(onionMoneyMapSplit);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  // Sync local split state when the store value changes (e.g., layout switch)
  useEffect(() => {
    setCurrentSplit(onionMoneyMapSplit);
  }, [onionMoneyMapSplit]);

  const handleSplitResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizingSplit(true);

      const container = splitContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerHeight = containerRect.height;
      const containerTop = containerRect.top;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const relativeY = moveEvent.clientY - containerTop;
        const newSplit = Math.max(45, Math.min(65, (relativeY / containerHeight) * 100));
        setCurrentSplit(newSplit);
      };

      const onMouseUp = () => {
        setIsResizingSplit(false);
        const finalSplit = Math.max(60, Math.min(40, currentSplit));
        useLayoutStore.getState().updateLayoutSettings({ onionMoneyMapSplit: finalSplit });
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [currentSplit]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden pb-[52px]">
      <WindowManager />
      <LayoutManagerPanel />
      <RatingOverlay />
      <NotificationToastBridge />
      <StockChatInput />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-w-0">
        {/* Watchlist hamburger toggle (left side) - hidden when detached */}
        {!watchlistDetached && (
          <button
            onClick={toggleWatchlist}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-30',
              'w-5 h-10 flex flex-col items-center justify-center gap-0.5',
              'bg-white/[0.06] hover:bg-white/10 border border-black rounded-r-md transition-all',
              watchlistOpen && 'left-64'
            )}
            title={watchlistOpen ? 'Close watchlist' : 'Open watchlist'}
          >
            <span className="w-2.5 h-0.5 bg-[#999999] rounded-full" />
            <span className="w-2.5 h-0.5 bg-[#999999] rounded-full" />
            <span className="w-2.5 h-0.5 bg-[#999999] rounded-full" />
          </button>
        )}

        {/* Watchlist Sidebar - collapsed when detached to make space */}
        {!watchlistDetached && (
          <div
            className={cn(
              'shrink-0 border-r border-black transition-all duration-300 overflow-hidden',
              watchlistOpen ? 'w-64' : 'w-0'
            )}
          >
            {watchlistPanel}
          </div>
        )}

        {/* Center + Right Layout */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top Asset Info Bar */}
          <AssetInfoBar />
          {/* Center Content */}
          <div className="flex-1 flex gap-px p-0 overflow-hidden min-w-0">
            {/* Stock Screener (left column) */}
            {isWidgetVisible('screener') && (
              <div className="w-[22%] shrink-0 overflow-hidden min-w-0">{stockScreener}</div>
            )}

            {/* Onion + MoneyMap combined column */}
            {(isWidgetVisible('onion') || isWidgetVisible('moneymap')) && (
              <div
                ref={splitContainerRef}
                className="w-[46%] shrink-0 flex flex-col gap-px overflow-hidden min-w-0"
              >
                {/* Chart (top) */}
                {isWidgetVisible('onion') && (
                  <div
                    className="overflow-hidden min-h-0"
                    style={{
                      height: isWidgetVisible('moneymap')
                        ? `${currentSplit}%`
                        : '100%',
                    }}
                  >
                    {onionChart}
                  </div>
                )}

                {/* Drag handle between chart and moneymap */}
                {isWidgetVisible('onion') && isWidgetVisible('moneymap') && (
                  <div
                    className={cn(
                      'h-1 cursor-row-resize hover:bg-[#AB9FF2]/50 transition-colors shrink-0',
                      isResizingSplit ? 'bg-[#AB9FF2]/50' : 'bg-black'
                    )}
                    onMouseDown={handleSplitResize}
                  />
                )}

                {/* MoneyMap (bottom) */}
                {isWidgetVisible('moneymap') && (
                  <div
                    className="overflow-hidden min-h-0"
                    style={{
                      height: isWidgetVisible('onion')
                        ? `${100 - currentSplit}%`
                        : '100%',
                    }}
                  >
                    {moneyMaps}
                  </div>
                )}
              </div>
            )}

            {/* Details Panel (right) */}
            {isWidgetVisible('details') && (
              <div className="flex-1 overflow-hidden min-w-0">
                {detailsPanel}
              </div>
            )}
          </div>

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
