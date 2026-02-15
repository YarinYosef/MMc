'use client';

import { create } from 'zustand';
import { type Ticker } from '@/data/types/market';
import {
  type ScreenerFilters,
  type ScreenerSortField,
  type SortDirection,
  type ScreenerPreset,
  type MarketCapCategory,
} from '@/data/types/screener';
import { useMarketStore } from '@/stores/useMarketStore';
import { TICKER_UNIVERSE, type TickerDef } from '@/data/constants/tickers';

// ── Default filter state ──────────────────────────────────────────────

const DEFAULT_FILTERS: ScreenerFilters = {
  search: '',
  sector: '',
  marketCap: 'all',
  priceRange: {},
  changeRange: {},
  volumeAboveAvg: false,
  peRange: {},
  betaRange: {},
  dividendYieldMin: null,
  near52WeekHigh: false,
  near52WeekLow: false,
};

// ── Preset definitions ────────────────────────────────────────────────

const PRESET_CONFIGS: Record<ScreenerPreset, { filters: Partial<ScreenerFilters>; sortField: ScreenerSortField; sortDirection: SortDirection }> = {
  'all': {
    filters: {},
    sortField: 'marketCap',
    sortDirection: 'desc',
  },
  'top-gainers': {
    filters: { changeRange: { min: 0 } },
    sortField: 'changePercent',
    sortDirection: 'desc',
  },
  'top-losers': {
    filters: { changeRange: { max: 0 } },
    sortField: 'changePercent',
    sortDirection: 'asc',
  },
  'most-active': {
    filters: { volumeAboveAvg: true },
    sortField: 'volume',
    sortDirection: 'desc',
  },
  'high-dividend': {
    filters: { dividendYieldMin: 2 },
    sortField: 'dividendYield',
    sortDirection: 'desc',
  },
  'low-pe': {
    filters: { peRange: { min: 0, max: 20 } },
    sortField: 'pe',
    sortDirection: 'asc',
  },
};

// ── Market cap classification helpers ─────────────────────────────────

function classifyMarketCap(marketCapValue: number): MarketCapCategory {
  const billions = marketCapValue / 1e9;
  if (billions >= 200) return 'mega';
  if (billions >= 10) return 'large';
  if (billions >= 2) return 'mid';
  if (billions >= 0.3) return 'small';
  return 'micro';
}

function matchesMarketCap(ticker: Ticker, category: MarketCapCategory): boolean {
  if (category === 'all') return true;
  return classifyMarketCap(ticker.marketCap) === category;
}

// ── 52-week proximity check (within 5%) ───────────────────────────────

const WEEK_52_THRESHOLD = 0.05;

// ── Filter engine ─────────────────────────────────────────────────────

function applyFilters(ticker: Ticker, tickerDef: TickerDef | undefined, filters: ScreenerFilters): boolean {
  // Search filter (symbol or name)
  if (filters.search) {
    const q = filters.search.toLowerCase();
    const matchesSymbol = ticker.symbol.toLowerCase().includes(q);
    const matchesName = ticker.name.toLowerCase().includes(q);
    if (!matchesSymbol && !matchesName) return false;
  }

  // Sector filter
  if (filters.sector && ticker.sector !== filters.sector) return false;

  // Market cap category
  if (!matchesMarketCap(ticker, filters.marketCap)) return false;

  // Price range
  if (filters.priceRange.min != null && ticker.price < filters.priceRange.min) return false;
  if (filters.priceRange.max != null && ticker.price > filters.priceRange.max) return false;

  // Change% range
  if (filters.changeRange.min != null && ticker.changePercent < filters.changeRange.min) return false;
  if (filters.changeRange.max != null && ticker.changePercent > filters.changeRange.max) return false;

  // Volume above average
  if (filters.volumeAboveAvg && ticker.volume <= ticker.avgVolume) return false;

  // P/E range
  if (filters.peRange.min != null && ticker.pe < filters.peRange.min) return false;
  if (filters.peRange.max != null && ticker.pe > filters.peRange.max) return false;

  // Beta range
  if (filters.betaRange.min != null && ticker.beta < filters.betaRange.min) return false;
  if (filters.betaRange.max != null && ticker.beta > filters.betaRange.max) return false;

  // Dividend yield minimum
  if (filters.dividendYieldMin != null && ticker.dividendYield < filters.dividendYieldMin) return false;

  // Near 52-week high (within 5% of high)
  if (filters.near52WeekHigh) {
    const threshold = ticker.high52w * (1 - WEEK_52_THRESHOLD);
    if (ticker.price < threshold) return false;
  }

  // Near 52-week low (within 5% of low)
  if (filters.near52WeekLow) {
    const threshold = ticker.low52w * (1 + WEEK_52_THRESHOLD);
    if (ticker.price > threshold) return false;
  }

  return true;
}

// ── Sort comparator ───────────────────────────────────────────────────

function compareTickers(a: Ticker, b: Ticker, field: ScreenerSortField, direction: SortDirection): number {
  let aVal: number | string;
  let bVal: number | string;

  switch (field) {
    case 'symbol':
      aVal = a.symbol;
      bVal = b.symbol;
      break;
    case 'price':
      aVal = a.price;
      bVal = b.price;
      break;
    case 'changePercent':
      aVal = a.changePercent;
      bVal = b.changePercent;
      break;
    case 'volume':
      aVal = a.volume;
      bVal = b.volume;
      break;
    case 'marketCap':
      aVal = a.marketCap;
      bVal = b.marketCap;
      break;
    case 'pe':
      aVal = a.pe;
      bVal = b.pe;
      break;
    case 'beta':
      aVal = a.beta;
      bVal = b.beta;
      break;
    case 'dividendYield':
      aVal = a.dividendYield;
      bVal = b.dividendYield;
      break;
    default:
      return 0;
  }

  let result: number;
  if (typeof aVal === 'string' && typeof bVal === 'string') {
    result = aVal.localeCompare(bVal);
  } else {
    result = (aVal as number) - (bVal as number);
  }

  return direction === 'desc' ? -result : result;
}

// ── Build the ticker def lookup once ──────────────────────────────────

const tickerDefMap = new Map<string, TickerDef>();
for (const def of TICKER_UNIVERSE) {
  tickerDefMap.set(def.symbol, def);
}

// ── Store interface ───────────────────────────────────────────────────

interface ScreenerState {
  filters: ScreenerFilters;
  sortField: ScreenerSortField;
  sortDirection: SortDirection;
  activePreset: ScreenerPreset;

  // Actions
  setFilter: <K extends keyof ScreenerFilters>(key: K, value: ScreenerFilters[K]) => void;
  setSortField: (field: ScreenerSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  applyPreset: (preset: ScreenerPreset) => void;
  resetFilters: () => void;

  // Computed
  getFilteredTickers: () => Ticker[];
}

export const useScreenerStore = create<ScreenerState>((set, get) => ({
  filters: { ...DEFAULT_FILTERS },
  sortField: 'marketCap',
  sortDirection: 'desc',
  activePreset: 'all',

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      activePreset: 'all', // reset preset when manually changing filters
    }));
  },

  setSortField: (field) => {
    const state = get();
    // Toggle direction if same field clicked
    if (state.sortField === field) {
      set({ sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      set({ sortField: field, sortDirection: 'desc' });
    }
  },

  setSortDirection: (direction) => set({ sortDirection: direction }),

  applyPreset: (preset) => {
    const config = PRESET_CONFIGS[preset];
    set({
      filters: { ...DEFAULT_FILTERS, ...config.filters },
      sortField: config.sortField,
      sortDirection: config.sortDirection,
      activePreset: preset,
    });
  },

  resetFilters: () => {
    set({
      filters: { ...DEFAULT_FILTERS },
      sortField: 'marketCap',
      sortDirection: 'desc',
      activePreset: 'all',
    });
  },

  getFilteredTickers: () => {
    const { filters, sortField, sortDirection } = get();
    const tickers = useMarketStore.getState().tickers;

    const results: Ticker[] = [];

    // Iterate over the ticker universe to ensure consistent ordering base
    for (const def of TICKER_UNIVERSE) {
      const ticker = tickers.get(def.symbol);
      if (!ticker) continue;
      if (applyFilters(ticker, def, filters)) {
        results.push(ticker);
      }
    }

    results.sort((a, b) => compareTickers(a, b, sortField, sortDirection));

    return results;
  },
}));
