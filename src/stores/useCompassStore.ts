'use client';

import { create } from 'zustand';
import { type CompassState, type CompassId, type CompassLayer, type CompassBarState } from '@/data/types/compass';
import { DEFAULT_COMPASS_ORDER } from '@/data/constants/compassConfig';
import { generateAllCompassStates } from '@/data/generators/compassDataGenerator';

interface CompassStoreState {
  compassStates: Map<CompassId, CompassState>;
  barState: CompassBarState;
  intervalId: ReturnType<typeof setInterval> | null;

  // Actions
  startUpdates: () => void;
  stopUpdates: () => void;
  setExpanded: (id: CompassId | null) => void;
  setHovered: (id: CompassId | null) => void;
  setLayerFilter: (layer: CompassLayer | 'all') => void;
  reorderCompasses: (newOrder: CompassId[]) => void;
  toggleHidden: (id: CompassId) => void;
  getCompassState: (id: CompassId) => CompassState | undefined;
}

export const useCompassStore = create<CompassStoreState>((set, get) => ({
  compassStates: new Map(),
  barState: {
    order: [...DEFAULT_COMPASS_ORDER],
    expanded: null,
    hovered: null,
    hidden: new Set<CompassId>(),
    layerFilter: 'all',
  },
  intervalId: null,

  startUpdates: () => {
    if (get().intervalId) return;

    // Initial generation
    const initial = generateAllCompassStates();
    set({ compassStates: initial });

    // Update every 2 seconds
    const id = setInterval(() => {
      const current = get().compassStates;
      const updated = generateAllCompassStates(current);
      set({ compassStates: updated });
    }, 2000);

    set({ intervalId: id });
  },

  stopUpdates: () => {
    const id = get().intervalId;
    if (id) {
      clearInterval(id);
      set({ intervalId: null });
    }
  },

  setExpanded: (id) =>
    set((state) => ({
      barState: { ...state.barState, expanded: id },
    })),

  setHovered: (id) =>
    set((state) => ({
      barState: { ...state.barState, hovered: id },
    })),

  setLayerFilter: (layer) =>
    set((state) => ({
      barState: { ...state.barState, layerFilter: layer },
    })),

  reorderCompasses: (newOrder) =>
    set((state) => ({
      barState: { ...state.barState, order: newOrder },
    })),

  toggleHidden: (id) =>
    set((state) => {
      const hidden = new Set(state.barState.hidden);
      if (hidden.has(id)) {
        hidden.delete(id);
      } else {
        hidden.add(id);
      }
      return { barState: { ...state.barState, hidden } };
    }),

  getCompassState: (id) => get().compassStates.get(id),
}));
