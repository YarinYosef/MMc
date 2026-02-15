export type ScreenerSortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap' | 'pe' | 'beta' | 'dividendYield';
export type SortDirection = 'asc' | 'desc';
export type MarketCapCategory = 'all' | 'mega' | 'large' | 'mid' | 'small' | 'micro';
export type ScreenerPreset = 'all' | 'top-gainers' | 'top-losers' | 'most-active' | 'high-dividend' | 'low-pe';

export interface FilterRange {
  min?: number;
  max?: number;
}

export interface ScreenerFilters {
  search: string;
  sector: string; // '' for all
  marketCap: MarketCapCategory;
  priceRange: FilterRange;
  changeRange: FilterRange;
  volumeAboveAvg: boolean;
  peRange: FilterRange;
  betaRange: FilterRange;
  dividendYieldMin: number | null;
  near52WeekHigh: boolean;
  near52WeekLow: boolean;
}
