'use client';

import { create } from 'zustand';
import { type NewsItem, type NewsFeedConfig, type NewsFeedState, type NewsFeedType } from '@/data/types/news';
import { NEWS_FEED_COLORS } from '@/data/constants/colors';
import {
  generateNewsBatch,
  generateGlobalNews,
  generateTrendNews,
  generateLookingAtNews,
  generateWatchlistNews,
} from '@/data/generators/newsGenerator';
import { broadcastStateUpdate } from '@/lib/syncEngine';

const MAX_ITEMS_PER_FEED = 200;

interface NewsStoreState extends NewsFeedState {
  intervalId: ReturnType<typeof setInterval> | null;
  lookingAtTickers: string[];
  lookingAtSectors: string[];
  subscribedSymbols: string[];

  // Actions
  startNewsFeed: () => void;
  stopNewsFeed: () => void;
  setExpanded: (expanded: boolean) => void;
  setHeightPercent: (percent: number) => void;
  toggleAutoScroll: () => void;
  selectItem: (id: string | null) => void;
  setDetached: (detached: boolean) => void;
  addFeed: (feed: NewsFeedConfig) => void;
  removeFeed: (feedId: string) => void;
  getAllItems: () => NewsItem[];

  // Context updates
  setLookingAtContext: (tickers: string[], sectors: string[]) => void;
  setSubscribedSymbols: (symbols: string[]) => void;
}

const DEFAULT_FEEDS: NewsFeedConfig[] = [
  { id: 'global', type: 'global', label: 'Global', color: NEWS_FEED_COLORS.global },
  { id: 'trend', type: 'trend', label: 'Trends', color: NEWS_FEED_COLORS.trend },
  { id: 'looking-at', type: 'looking-at', label: 'Looking At', color: NEWS_FEED_COLORS['looking-at'] },
  { id: 'watchlist', type: 'watchlist', label: 'Watchlist', color: NEWS_FEED_COLORS.watchlist },
];

function emptyItems(): Record<NewsFeedType, NewsItem[]> {
  return { global: [], trend: [], 'looking-at': [], watchlist: [] };
}

export const useNewsStore = create<NewsStoreState>((set, get) => ({
  feeds: DEFAULT_FEEDS,
  items: emptyItems(),
  isExpanded: false,
  heightPercent: 8,
  autoScroll: true,
  selectedItemId: null,
  isDetached: false,
  intervalId: null,
  lookingAtTickers: [],
  lookingAtSectors: [],
  subscribedSymbols: [],

  startNewsFeed: () => {
    if (get().intervalId) return;

    // Generate initial batch
    set({ items: generateNewsBatch(15) });

    // Rotate through feeds, add new item every 4-8 seconds
    const feedTypes: NewsFeedType[] = ['global', 'trend', 'looking-at', 'watchlist'];
    let feedIndex = 0;

    const id = setInterval(() => {
      const state = get();
      const currentFeed = feedTypes[feedIndex % feedTypes.length];
      feedIndex++;

      let newItem: NewsItem;
      switch (currentFeed) {
        case 'global':
          newItem = generateGlobalNews();
          break;
        case 'trend':
          newItem = generateTrendNews();
          break;
        case 'looking-at':
          newItem = generateLookingAtNews(state.lookingAtTickers, state.lookingAtSectors);
          break;
        case 'watchlist':
          newItem = generateWatchlistNews(state.subscribedSymbols);
          break;
      }

      set((prev) => {
        const feedItems = prev.items[currentFeed];
        const updatedFeed = [newItem, ...feedItems].slice(0, MAX_ITEMS_PER_FEED);
        return { items: { ...prev.items, [currentFeed]: updatedFeed } };
      });

      broadcastStateUpdate('news', { type: 'new-item', feedType: currentFeed, item: newItem });
    }, 4000 + Math.random() * 4000);

    set({ intervalId: id });
  },

  stopNewsFeed: () => {
    const id = get().intervalId;
    if (id) {
      clearInterval(id);
      set({ intervalId: null });
    }
  },

  setExpanded: (expanded) => set({ isExpanded: expanded }),

  setHeightPercent: (percent) =>
    set({ heightPercent: Math.max(8, Math.min(15, percent)) }),

  toggleAutoScroll: () => set((state) => ({ autoScroll: !state.autoScroll })),

  selectItem: (id) => set({ selectedItemId: id }),

  setDetached: (detached) => set({ isDetached: detached }),

  setLookingAtContext: (tickers, sectors) => {
    set({ lookingAtTickers: tickers, lookingAtSectors: sectors });
    // Generate a few context-aware items immediately when context changes
    if (tickers.length > 0 || sectors.length > 0) {
      const newItems = Array.from({ length: 3 }, () =>
        generateLookingAtNews(tickers, sectors)
      ).sort((a, b) => b.timestamp - a.timestamp);

      set((state) => ({
        items: {
          ...state.items,
          'looking-at': [...newItems, ...state.items['looking-at']].slice(0, MAX_ITEMS_PER_FEED),
        },
      }));
    }
  },

  setSubscribedSymbols: (symbols) => set({ subscribedSymbols: symbols }),

  addFeed: (feed) =>
    set((state) => ({ feeds: [...state.feeds, feed] })),

  removeFeed: (feedId) =>
    set((state) => ({ feeds: state.feeds.filter((f) => f.id !== feedId) })),

  getAllItems: () => {
    const items = get().items;
    return Object.values(items).flat().sort((a, b) => b.timestamp - a.timestamp);
  },
}));
