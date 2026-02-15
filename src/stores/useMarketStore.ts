'use client';

import { create } from 'zustand';
import { type Ticker, type MarketIndex } from '@/data/types/market';
import { marketEngine } from '@/data/generators/marketDataEngine';

interface MarketState {
  tickers: Map<string, Ticker>;
  indices: MarketIndex[];
  selectedTicker: string | null;
  isRunning: boolean;

  // Actions
  setSelectedTicker: (symbol: string | null) => void;
  startEngine: () => void;
  stopEngine: () => void;
  getTicker: (symbol: string) => Ticker | undefined;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  tickers: new Map(),
  indices: [],
  selectedTicker: 'MSFT',
  isRunning: false,

  setSelectedTicker: (symbol) => set({ selectedTicker: symbol }),

  startEngine: () => {
    if (get().isRunning) return;

    // Initialize with current data
    set({
      tickers: marketEngine.getAllTickers(),
      indices: marketEngine.getIndices(),
      isRunning: true,
    });

    // Subscribe to updates
    marketEngine.subscribe((tickers) => {
      set({
        tickers,
        indices: marketEngine.getIndices(),
      });
    });

    marketEngine.start();
  },

  stopEngine: () => {
    marketEngine.stop();
    set({ isRunning: false });
  },

  getTicker: (symbol) => get().tickers.get(symbol),
}));
