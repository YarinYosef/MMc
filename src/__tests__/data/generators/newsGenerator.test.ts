import {
  generateNewsItem,
  generateNewsBatch,
  generateGlobalNews,
  generateTrendNews,
  generateLookingAtNews,
  generateWatchlistNews,
} from '@/data/generators/newsGenerator';
import type { NewsFeedType } from '@/data/types/news';

describe('generateNewsItem', () => {
  it('produces a valid news item', () => {
    const item = generateNewsItem();
    expect(item.id).toBeDefined();
    expect(typeof item.headline).toBe('string');
    expect(item.headline.length).toBeGreaterThan(0);
    expect(typeof item.summary).toBe('string');
    expect(['reuters', 'bloomberg', 'wsj', 'cnbc', 'ft', 'social']).toContain(item.source);
    expect(['positive', 'neutral', 'negative']).toContain(item.sentiment);
    expect(['global', 'trend', 'looking-at', 'watchlist']).toContain(item.feedType);
    expect(item.tickers.length).toBeGreaterThan(0);
    expect(item.sectors.length).toBeGreaterThan(0);
    expect(item.impact).toBeGreaterThanOrEqual(0);
    expect(item.impact).toBeLessThan(100);
    expect(typeof item.relevanceScore).toBe('number');
    expect(typeof item.timestamp).toBe('number');
  });

  it('generates unique ids', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateNewsItem().id);
    }
    expect(ids.size).toBe(100);
  });

  it('generates item with specified feed type', () => {
    const item = generateNewsItem('global');
    expect(item.feedType).toBe('global');
  });
});

describe('generateGlobalNews', () => {
  it('generates global news', () => {
    const item = generateGlobalNews();
    expect(item.feedType).toBe('global');
  });
});

describe('generateTrendNews', () => {
  it('generates trend news', () => {
    const item = generateTrendNews();
    expect(item.feedType).toBe('trend');
  });
});

describe('generateLookingAtNews', () => {
  it('generates looking-at news', () => {
    const item = generateLookingAtNews(['MSFT'], ['Technology']);
    expect(item.feedType).toBe('looking-at');
  });

  it('uses provided tickers', () => {
    const item = generateLookingAtNews(['MSFT'], ['Technology']);
    expect(item.tickers).toContain('MSFT');
  });
});

describe('generateWatchlistNews', () => {
  it('generates watchlist news', () => {
    const item = generateWatchlistNews(['AAPL']);
    expect(item.feedType).toBe('watchlist');
  });
});

describe('generateNewsBatch', () => {
  it('produces items per feed type', () => {
    const batch = generateNewsBatch(5);
    expect(batch.global).toHaveLength(5);
    expect(batch.trend).toHaveLength(5);
    expect(batch['looking-at']).toHaveLength(5);
    expect(batch.watchlist).toHaveLength(5);
  });

  it('items within each feed are sorted by timestamp descending', () => {
    const batch = generateNewsBatch(10);
    for (const feedType of ['global', 'trend', 'looking-at', 'watchlist'] as NewsFeedType[]) {
      const items = batch[feedType];
      for (let i = 1; i < items.length; i++) {
        expect(items[i - 1].timestamp).toBeGreaterThanOrEqual(items[i].timestamp);
      }
    }
  });

  it('handles zero items per feed', () => {
    const batch = generateNewsBatch(0);
    expect(batch.global).toHaveLength(0);
    expect(batch.trend).toHaveLength(0);
    expect(batch['looking-at']).toHaveLength(0);
    expect(batch.watchlist).toHaveLength(0);
  });
});
