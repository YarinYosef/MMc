'use client';

import { create } from 'zustand';
import { type OnionState, type OnionRingType, type MoneyMapType } from '@/data/types/onion';
import { type Timeframe } from '@/data/types/market';

interface OnionStoreState extends OnionState {
  activeMoneyMap: MoneyMapType;

  // Actions
  selectRing: (ring: OnionRingType | null) => void;
  selectSegment: (segmentId: string | null) => void;
  setHoveredSegment: (segmentId: string | null) => void;
  setTimeframe: (tf: Timeframe) => void;
  drillDown: (segmentId: string) => void;
  drillUp: () => void;
  resetDrill: () => void;
  setDrillPath: (path: string[]) => void;
  setActiveMoneyMap: (type: MoneyMapType) => void;
}

export const useOnionStore = create<OnionStoreState>((set) => ({
  selectedRing: null,
  selectedSegment: null,
  hoveredSegment: null,
  timeframe: '1D',
  drillPath: [],
  rotation: 0,
  activeMoneyMap: 'cross-asset',

  selectRing: (ring) => set({ selectedRing: ring }),

  selectSegment: (segmentId) => set({ selectedSegment: segmentId }),

  setHoveredSegment: (segmentId) => set({ hoveredSegment: segmentId }),

  setTimeframe: (tf) => set({ timeframe: tf }),

  drillDown: (segmentId) =>
    set((state) => ({
      drillPath: [...state.drillPath, segmentId],
      selectedSegment: segmentId,
    })),

  drillUp: () =>
    set((state) => {
      const newPath = state.drillPath.slice(0, -1);
      return {
        drillPath: newPath,
        selectedSegment: newPath[newPath.length - 1] ?? null,
      };
    }),

  resetDrill: () => set({ drillPath: [], selectedSegment: null, selectedRing: null }),

  setDrillPath: (path: string[]) =>
    set({ drillPath: path, selectedSegment: path[path.length - 1] ?? null }),

  setActiveMoneyMap: (type) => set({ activeMoneyMap: type }),
}));
