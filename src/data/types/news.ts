export type NewsSentiment = 'positive' | 'neutral' | 'negative';

export type NewsSource = 'reuters' | 'bloomberg' | 'wsj' | 'cnbc' | 'ft' | 'social';

export type NewsFeedType = 'global' | 'trend' | 'looking-at' | 'watchlist';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: NewsSource;
  timestamp: number;
  sentiment: NewsSentiment;
  tickers: string[];
  sectors: string[];
  feedType: NewsFeedType;
  impact: number; // 0-100
  relevanceScore: number; // 0-100
  url?: string;
}

export interface NewsFeedConfig {
  id: string;
  type: NewsFeedType;
  label: string;
  color: string;
  filter?: {
    tickers?: string[];
    sectors?: string[];
    sentiment?: NewsSentiment[];
  };
}

export interface NewsFeedState {
  feeds: NewsFeedConfig[];
  items: Record<NewsFeedType, NewsItem[]>;
  isExpanded: boolean;
  heightPercent: number; // 8-15
  autoScroll: boolean;
  selectedItemId: string | null;
  isDetached: boolean;
}
