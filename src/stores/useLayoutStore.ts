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
import { useCompassStore } from '@/stores/useCompassStore';

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

  // Persistence and settings
  loadLayouts: () => void;
  saveLayouts: () => void;
  updateLayoutSettings: (settings: Partial<DashboardLayout>) => void;
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
    { id: 'stock-screener', type: 'screener', order: 6, visible: true },
  ],
  newsHeightPercent: 8,
  onionMoneyMapSplit: 65,
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
    const state = get();
    const customCount = state.savedLayouts.filter((l) => l.id !== 'default').length;
    if (customCount >= MAX_CUSTOM_LAYOUTS) {
      toast.warning(`Maximum ${MAX_CUSTOM_LAYOUTS} custom layouts allowed. Delete one to save a new layout.`);
      return;
    }

    const currentLayout = state.savedLayouts.find((l) => l.id === state.currentLayoutId) || DEFAULT_LAYOUT;

    // Capture current compass hidden state
    const compassHidden = Array.from(useCompassStore.getState().barState.hidden) as string[];

    const newLayout: DashboardLayout = {
      ...currentLayout,
      id: uuidv4(),
      name,
      createdAt: Date.now(),
      // Ensure we capture current windows if any
      detachedWindows: state.windows,
      hiddenCompasses: compassHidden,
    };
    set((state) => ({
      savedLayouts: [...state.savedLayouts, newLayout],
      currentLayoutId: newLayout.id,
    }));
    get().saveLayouts();
    toast.success(`Layout "${name}" saved.`);
  },

  loadLayout: (layoutId) => {
    const layout = get().savedLayouts.find((l) => l.id === layoutId);
    if (layout) {
      // Track usage for auto-restore
      const counts = { ...get().layoutUsageCounts };
      counts[layoutId] = (counts[layoutId] ?? 0) + 1;
      set({ currentLayoutId: layoutId, layoutUsageCounts: counts });
      saveToStorage('layout-usage', counts);

      // Restore compass hidden state if saved
      if (layout.hiddenCompasses) {
        const newHidden = new Set(layout.hiddenCompasses as any[]);
        useCompassStore.setState((cs) => ({
          barState: { ...cs.barState, hidden: newHidden },
        }));
      }
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
      // Restore saved default if it exists, otherwise use hardcoded fallback
      const savedDefault = saved.find((l) => l.id === 'default');
      const custom = saved.filter((l) => l.id !== 'default').slice(0, MAX_CUSTOM_LAYOUTS);
      const defaultLayout = savedDefault
        ? { ...DEFAULT_LAYOUT, ...savedDefault, widgets: savedDefault.widgets ?? DEFAULT_LAYOUT.widgets }
        : DEFAULT_LAYOUT;
      set({ savedLayouts: [defaultLayout, ...custom] });
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

    // Restore compass hidden state for the active layout
    const activeLayout = get().savedLayouts.find((l) => l.id === get().currentLayoutId);
    if (activeLayout?.hiddenCompasses) {
      const newHidden = new Set(activeLayout.hiddenCompasses as any[]);
      useCompassStore.setState((cs) => ({
        barState: { ...cs.barState, hidden: newHidden },
      }));
    }
  },

  updateLayoutSettings: (settings: Partial<DashboardLayout>) => {
    set((state) => ({
      savedLayouts: state.savedLayouts.map((layout) => {
        if (layout.id !== state.currentLayoutId) return layout;
        return { ...layout, ...settings };
      }),
    }));
    get().saveLayouts();
  },

  saveLayouts: () => {
    // Persist ALL layouts including modified default so changes survive reload
    saveToStorage('layouts', get().savedLayouts);
  },
}));
