'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  type WatchlistGroup,
  type WatchlistItem,
  type WatchlistState,
  type WatchlistItemType,
  type NotificationPreferences,
  type NotificationContactInfo,
} from '@/data/types/watchlist';
import { WATCHLIST_COLORS } from '@/data/constants/colors';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';
import { broadcastStateUpdate } from '@/lib/syncEngine';
import { toast } from 'react-toastify';

const MAX_WATCHLISTS = 10;
const MAX_ITEMS_PER_WATCHLIST = 100;

interface WatchlistStoreState extends WatchlistState {
  // Panel controls
  toggleOpen: () => void;
  setDetached: (detached: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveGroup: (groupId: string | null) => void;
  setFilterGroup: (groupId: string | null) => void;

  // Group management
  createGroup: (name: string, color?: string) => string | null;
  deleteGroup: (groupId: string) => void;
  renameGroup: (groupId: string, name: string) => void;
  setGroupColor: (groupId: string, color: string) => void;
  reorderGroups: (fromIndex: number, toIndex: number) => void;

  // Item management
  addItem: (groupId: string, symbol: string, type?: WatchlistItemType) => void;
  removeItem: (groupId: string, symbol: string) => void;
  updateItemNotes: (groupId: string, symbol: string, notes: string) => void;
  setAlert: (groupId: string, symbol: string, price: number, direction: 'above' | 'below') => void;
  toggleNewsSubscription: (groupId: string, symbol: string) => void;
  moveItem: (fromGroupId: string, toGroupId: string, symbol: string, toIndex: number) => void;

  // Notification preferences
  setNotificationPref: (groupId: string, prefs: Partial<NotificationPreferences>) => void;
  setContactInfo: (info: Partial<NotificationContactInfo>) => void;

  // Computed
  getSubscribedSymbols: () => string[];

  // Persistence
  loadWatchlists: () => void;
  saveWatchlists: () => void;
}

const DEFAULT_GROUPS: WatchlistGroup[] = [
  {
    id: 'default',
    name: 'Main Watchlist',
    color: WATCHLIST_COLORS[0],
    items: [
      { symbol: 'MSFT', type: 'ticker', addedAt: Date.now(), subscribedToNews: true },
      { symbol: 'AAPL', type: 'ticker', addedAt: Date.now(), subscribedToNews: true },
      { symbol: 'NVDA', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
      { symbol: 'GOOGL', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
      { symbol: 'AMZN', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
    ],
    createdAt: Date.now(),
    sortOrder: 0,
  },
  {
    id: 'tech-semis',
    name: 'Semiconductors',
    color: WATCHLIST_COLORS[4],
    items: [
      { symbol: 'NVDA', type: 'ticker', addedAt: Date.now(), subscribedToNews: true },
      { symbol: 'AMD', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
      { symbol: 'AVGO', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
      { symbol: 'INTC', type: 'ticker', addedAt: Date.now(), subscribedToNews: false },
    ],
    createdAt: Date.now(),
    sortOrder: 1,
  },
];

export const useWatchlistStore = create<WatchlistStoreState>((set, get) => ({
  groups: DEFAULT_GROUPS,
  isOpen: false,
  activeGroupId: 'default',
  filterGroupId: null,
  searchQuery: '',
  isDetached: false,
  notificationPrefs: [],
  contactInfo: { emailAddress: '', phoneNumber: '' },

  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  setDetached: (detached) => set({ isDetached: detached }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveGroup: (groupId) => set({ activeGroupId: groupId }),

  setFilterGroup: (groupId) => set({ filterGroupId: groupId }),

  createGroup: (name, color) => {
    const state = get();
    if (state.groups.length >= MAX_WATCHLISTS) {
      toast.warning(`Maximum ${MAX_WATCHLISTS} watchlists allowed. Delete one to create a new watchlist.`);
      return null;
    }

    const id = uuidv4();
    const usedColors = state.groups.map((g) => g.color);
    const assignedColor = color ?? WATCHLIST_COLORS.find((c) => !usedColors.includes(c)) ?? WATCHLIST_COLORS[0];

    set((prev) => ({
      groups: [
        ...prev.groups,
        {
          id,
          name,
          color: assignedColor,
          items: [],
          createdAt: Date.now(),
          sortOrder: prev.groups.length,
        },
      ],
      activeGroupId: id,
    }));

    get().saveWatchlists();
    broadcastStateUpdate('watchlist', { type: 'group-created', groupId: id });
    return id;
  },

  deleteGroup: (groupId) => {
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== groupId),
      activeGroupId: state.activeGroupId === groupId
        ? (state.groups.find((g) => g.id !== groupId)?.id ?? null)
        : state.activeGroupId,
    }));
    get().saveWatchlists();
    broadcastStateUpdate('watchlist', { type: 'group-deleted', groupId });
  },

  renameGroup: (groupId, name) => {
    set((state) => ({
      groups: state.groups.map((g) => (g.id === groupId ? { ...g, name } : g)),
    }));
    get().saveWatchlists();
  },

  setGroupColor: (groupId, color) => {
    set((state) => ({
      groups: state.groups.map((g) => (g.id === groupId ? { ...g, color } : g)),
    }));
    get().saveWatchlists();
  },

  reorderGroups: (fromIndex, toIndex) => {
    set((state) => {
      const groups = [...state.groups];
      const [moved] = groups.splice(fromIndex, 1);
      groups.splice(toIndex, 0, moved);
      return { groups: groups.map((g, i) => ({ ...g, sortOrder: i })) };
    });
    get().saveWatchlists();
  },

  addItem: (groupId, symbol, type = 'ticker') => {
    const group = get().groups.find((g) => g.id === groupId);
    if (group) {
      if (group.items.length >= MAX_ITEMS_PER_WATCHLIST) {
        toast.warning(`Maximum ${MAX_ITEMS_PER_WATCHLIST} tickers per watchlist. Remove one to add more.`);
        return;
      }
      if (group.items.some((i) => i.symbol === symbol)) {
        toast.info(`${symbol} is already in this watchlist.`);
        return;
      }
    }
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        const newItem: WatchlistItem = { symbol, type, addedAt: Date.now(), subscribedToNews: false };
        return { ...g, items: [...g.items, newItem] };
      }),
    }));
    get().saveWatchlists();
  },

  removeItem: (groupId, symbol) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return { ...g, items: g.items.filter((i) => i.symbol !== symbol) };
      }),
    }));
    get().saveWatchlists();
  },

  updateItemNotes: (groupId, symbol, notes) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) => (i.symbol === symbol ? { ...i, notes } : i)),
        };
      }),
    }));
    get().saveWatchlists();
  },

  setAlert: (groupId, symbol, price, direction) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) =>
            i.symbol === symbol ? { ...i, alertPrice: price, alertDirection: direction } : i
          ),
        };
      }),
    }));
    get().saveWatchlists();
  },

  toggleNewsSubscription: (groupId, symbol) => {
    set((state) => ({
      groups: state.groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((i) =>
            i.symbol === symbol ? { ...i, subscribedToNews: !i.subscribedToNews } : i
          ),
        };
      }),
    }));
    get().saveWatchlists();
    broadcastStateUpdate('watchlist', { type: 'subscription-changed' });
  },

  moveItem: (fromGroupId, toGroupId, symbol, toIndex) => {
    // Same-group reorder
    if (fromGroupId === toGroupId) {
      set((state) => ({
        groups: state.groups.map((g) => {
          if (g.id !== fromGroupId) return g;
          const oldIndex = g.items.findIndex((i) => i.symbol === symbol);
          if (oldIndex === -1) return g;
          const newItems = [...g.items];
          const [moved] = newItems.splice(oldIndex, 1);
          newItems.splice(toIndex, 0, moved);
          return { ...g, items: newItems };
        }),
      }));
      get().saveWatchlists();
      return;
    }

    // Cross-group move
    const toGroup = get().groups.find((g) => g.id === toGroupId);
    if (toGroup && toGroup.items.length >= MAX_ITEMS_PER_WATCHLIST) {
      toast.warning(`Target watchlist is full (${MAX_ITEMS_PER_WATCHLIST} tickers max).`);
      return;
    }
    set((state) => {
      const fromGroup = state.groups.find((g) => g.id === fromGroupId);
      if (!fromGroup) return state;
      const item = fromGroup.items.find((i) => i.symbol === symbol);
      if (!item) return state;

      return {
        groups: state.groups.map((g) => {
          if (g.id === fromGroupId) {
            return { ...g, items: g.items.filter((i) => i.symbol !== symbol) };
          }
          if (g.id === toGroupId) {
            if (g.items.some((i) => i.symbol === symbol)) return g;
            const newItems = [...g.items];
            newItems.splice(toIndex, 0, item);
            return { ...g, items: newItems };
          }
          return g;
        }),
      };
    });
    get().saveWatchlists();
  },

  setNotificationPref: (groupId, prefs) => {
    set((state) => {
      const existing = state.notificationPrefs.find((p) => p.groupId === groupId);
      if (existing) {
        return {
          notificationPrefs: state.notificationPrefs.map((p) =>
            p.groupId === groupId ? { ...p, ...prefs } : p
          ),
        };
      }
      return {
        notificationPrefs: [
          ...state.notificationPrefs,
          { groupId, email: false, phone: false, inApp: true, frequency: 'immediate' as const, ...prefs },
        ],
      };
    });
    get().saveWatchlists();
  },

  setContactInfo: (info) => {
    set((state) => ({ contactInfo: { ...state.contactInfo, ...info } }));
    get().saveWatchlists();
  },

  getSubscribedSymbols: () => {
    const groups = get().groups;
    const symbols = new Set<string>();
    for (const group of groups) {
      for (const item of group.items) {
        if (item.subscribedToNews) {
          symbols.add(item.symbol);
        }
      }
    }
    return Array.from(symbols);
  },

  loadWatchlists: () => {
    const saved = loadFromStorage<WatchlistGroup[]>('watchlists');
    if (saved && saved.length > 0) {
      set({ groups: saved });
    }
    const prefs = loadFromStorage<NotificationPreferences[]>('watchlist-notifications');
    if (prefs) {
      set({ notificationPrefs: prefs });
    }
    const contact = loadFromStorage<NotificationContactInfo>('watchlist-contact');
    if (contact) {
      set({ contactInfo: contact });
    }
  },

  saveWatchlists: () => {
    saveToStorage('watchlists', get().groups);
    saveToStorage('watchlist-notifications', get().notificationPrefs);
    saveToStorage('watchlist-contact', get().contactInfo);
  },
}));
