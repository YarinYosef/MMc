'use client';

import { useEffect } from 'react';
import { useMarketUpdates } from '@/hooks/useMarketUpdates';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { broadcastStateUpdate } from '@/lib/syncEngine';
import { WatchlistPanel } from '@/components/watchlist/WatchlistPanel';

export default function DetachedWatchlistPage() {
  useMarketUpdates();

  // Sync selected symbol from main window
  useBroadcastChannel<{ type: string; symbol?: string | null }>('details', (msg) => {
    if (msg.type === 'symbol-changed' && msg.symbol !== undefined) {
      useDetailsStore.getState().setSelectedSymbol(msg.symbol);
    }
  });

  // Sync watchlist changes from main window
  useBroadcastChannel<{ type: string }>('watchlist', (msg) => {
    if (
      msg.type === 'group-created' ||
      msg.type === 'group-deleted' ||
      msg.type === 'subscription-changed' ||
      msg.type === 'reload-groups'
    ) {
      useWatchlistStore.getState().loadWatchlists();
    }
  });

  // Ensure watchlist is open, load persisted data, and notify main window on close
  useEffect(() => {
    const store = useWatchlistStore.getState();
    store.loadWatchlists();
    if (!store.isOpen) {
      store.toggleOpen();
    }
    store.setDetached(true);

    // When selecting a symbol in the detached watchlist, broadcast to main
    const unsub = useDetailsStore.subscribe((state, prev) => {
      if (state.selectedSymbol !== prev.selectedSymbol) {
        broadcastStateUpdate('details', {
          type: 'symbol-changed',
          symbol: state.selectedSymbol,
        });
      }
    });

    const handleBeforeUnload = () => {
      useWatchlistStore.getState().setDetached(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unsub();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 shrink-0">
        <span className="text-sm font-bold text-blue-400 tracking-wider">
          MMC WATCHLIST
        </span>
        <span className="text-[10px] text-slate-500">Detached Window</span>
      </div>

      {/* Full watchlist panel */}
      <div className="flex-1 overflow-hidden">
        <WatchlistPanel />
      </div>
    </div>
  );
}
