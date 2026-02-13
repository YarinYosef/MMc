'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  type LayoutState,
  type DashboardLayout,
  type WindowState,
  type ManagingPaneState,
} from '@/data/types/layout';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';
import { toast } from 'react-toastify';

interface LayoutStoreState extends LayoutState {
  managingPane: ManagingPaneState;
  layoutManagerOpen: boolean;
  ratingOverlayOpen: boolean;
  layoutUsageCounts: Record<string, number>;

  // Layout actions
  saveCurrentLayout: (name: string) => void;
  loadLayout: (layoutId: string) => void;
  deleteLayout: (layoutId: string) => void;
  setCurrentLayout: (layoutId: string) => void;

  // Widget visibility
  toggleWidgetVisibility: (widgetId: string) => void;
  isWidgetVisible: (widgetType: string) => boolean;

  // Window actions
  openWindow: (window: WindowState) => void;
  closeWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;

  // Drag actions
  startDrag: (sourceId: string) => void;
  setDragTarget: (targetId: string | null) => void;
  endDrag: () => void;

  // Managing pane
  toggleManagingPane: () => void;
  setManagingTab: (tab: ManagingPaneState['activeTab']) => void;

  // Layout manager panel
  toggleLayoutManager: () => void;

  // Rating overlay
  toggleRatingOverlay: () => void;

  // Layout usage tracking
  getMostUsedLayoutId: () => string;

  // Persistence
  loadLayouts: () => void;
  saveLayouts: () => void;
}

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Default Layout',
  createdAt: Date.now(),
  widgets: [
    { id: 'compass-bar', type: 'compass', order: 0, visible: true },
    { id: 'onion-chart', type: 'onion', order: 1, visible: true },
    { id: 'money-maps', type: 'moneymap', order: 2, visible: true },
    { id: 'details-panel', type: 'details', order: 3, visible: true },
    { id: 'news-feed', type: 'news', order: 4, visible: true },
    { id: 'watchlist', type: 'watchlist', order: 5, visible: true },
  ],
  newsHeightPercent: 8,
  detachedWindows: [],
};

const MAX_CUSTOM_LAYOUTS = 4;

export const useLayoutStore = create<LayoutStoreState>((set, get) => ({
  currentLayoutId: 'default',
  savedLayouts: [DEFAULT_LAYOUT],
  windows: [],
  isDragging: false,
  dragSource: null,
  dragTarget: null,
  managingPane: {
    isOpen: false,
    activeTab: 'notes',
  },
  layoutManagerOpen: false,
  ratingOverlayOpen: false,
  layoutUsageCounts: {},

  saveCurrentLayout: (name) => {
    const customCount = get().savedLayouts.filter((l) => l.id !== 'default').length;
    if (customCount >= MAX_CUSTOM_LAYOUTS) {
      toast.warning(`Maximum ${MAX_CUSTOM_LAYOUTS} custom layouts allowed. Delete one to save a new layout.`);
      return;
    }

    const newLayout: DashboardLayout = {
      ...DEFAULT_LAYOUT,
      id: uuidv4(),
      name,
      createdAt: Date.now(),
    };
    set((state) => ({
      savedLayouts: [...state.savedLayouts, newLayout],
      currentLayoutId: newLayout.id,
    }));
    get().saveLayouts();
  },

  loadLayout: (layoutId) => {
    const layout = get().savedLayouts.find((l) => l.id === layoutId);
    if (layout) {
      // Track usage for auto-restore
      const counts = { ...get().layoutUsageCounts };
      counts[layoutId] = (counts[layoutId] ?? 0) + 1;
      set({ currentLayoutId: layoutId, layoutUsageCounts: counts });
      saveToStorage('layout-usage', counts);
    }
  },

  deleteLayout: (layoutId) => {
    if (layoutId === 'default') return;
    set((state) => ({
      savedLayouts: state.savedLayouts.filter((l) => l.id !== layoutId),
      currentLayoutId: state.currentLayoutId === layoutId ? 'default' : state.currentLayoutId,
    }));
    get().saveLayouts();
  },

  setCurrentLayout: (layoutId) => set({ currentLayoutId: layoutId }),

  toggleWidgetVisibility: (widgetId) => {
    set((state) => ({
      savedLayouts: state.savedLayouts.map((layout) => {
        if (layout.id !== state.currentLayoutId) return layout;
        return {
          ...layout,
          widgets: layout.widgets.map((w) =>
            w.id === widgetId ? { ...w, visible: !w.visible } : w
          ),
        };
      }),
    }));
    get().saveLayouts();
  },

  isWidgetVisible: (widgetType) => {
    const state = get();
    const layout = state.savedLayouts.find((l) => l.id === state.currentLayoutId);
    if (!layout) return true;
    const widget = layout.widgets.find((w) => w.type === widgetType);
    return widget?.visible ?? true;
  },

  getMostUsedLayoutId: () => {
    const counts = get().layoutUsageCounts;
    let maxId = 'default';
    let maxCount = 0;
    for (const [id, count] of Object.entries(counts)) {
      // Only consider layouts that still exist
      if (count > maxCount && get().savedLayouts.some((l) => l.id === id)) {
        maxId = id;
        maxCount = count;
      }
    }
    return maxId;
  },

  openWindow: (window) =>
    set((state) => ({
      windows: [...state.windows.filter((w) => w.id !== window.id), window],
    })),

  closeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== windowId),
    })),

  updateWindowPosition: (windowId, position) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === windowId ? { ...w, position } : w)),
    })),

  updateWindowSize: (windowId, size) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === windowId ? { ...w, size } : w)),
    })),

  startDrag: (sourceId) => set({ isDragging: true, dragSource: sourceId }),

  setDragTarget: (targetId) => set({ dragTarget: targetId }),

  endDrag: () => set({ isDragging: false, dragSource: null, dragTarget: null }),

  toggleManagingPane: () =>
    set((state) => ({
      managingPane: { ...state.managingPane, isOpen: !state.managingPane.isOpen },
    })),

  setManagingTab: (tab) =>
    set((state) => ({
      managingPane: { ...state.managingPane, activeTab: tab },
    })),

  toggleLayoutManager: () =>
    set((state) => ({ layoutManagerOpen: !state.layoutManagerOpen })),

  toggleRatingOverlay: () =>
    set((state) => ({ ratingOverlayOpen: !state.ratingOverlayOpen })),

  loadLayouts: () => {
    const saved = loadFromStorage<DashboardLayout[]>('layouts');
    if (saved && saved.length > 0) {
      const custom = saved.filter((l) => l.id !== 'default').slice(0, MAX_CUSTOM_LAYOUTS);
      set({ savedLayouts: [DEFAULT_LAYOUT, ...custom] });
    }

    // Load usage counts
    const counts = loadFromStorage<Record<string, number>>('layout-usage');
    if (counts) {
      set({ layoutUsageCounts: counts });
    }

    // Auto-restore: load the most-used layout
    const mostUsed = get().getMostUsedLayoutId();
    if (mostUsed !== 'default' && get().savedLayouts.some((l) => l.id === mostUsed)) {
      set({ currentLayoutId: mostUsed });
    }
  },

  saveLayouts: () => {
    const layouts = get().savedLayouts.filter((l) => l.id !== 'default');
    saveToStorage('layouts', layouts);
  },
}));
