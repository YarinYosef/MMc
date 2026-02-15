import { useNewsStore } from '@/stores/useNewsStore';
import { NEWS_FEED_COLORS } from '@/data/constants/colors';
import type { NewsFeedType, NewsItem } from '@/data/types/news';

function emptyItems(): Record<NewsFeedType, NewsItem[]> {
  return { global: [], trend: [], 'looking-at': [], watchlist: [] };
}

beforeEach(() => {
  const state = useNewsStore.getState();
  if (state.intervalId) state.stopNewsFeed();
  useNewsStore.setState({
    feeds: [
      { id: 'global', type: 'global', label: 'Global', color: NEWS_FEED_COLORS.global },
      { id: 'trend', type: 'trend', label: 'Trend', color: NEWS_FEED_COLORS.trend },
      { id: 'looking-at', type: 'looking-at', label: 'Looking At', color: NEWS_FEED_COLORS['looking-at'] },
      { id: 'watchlist', type: 'watchlist', label: 'Watchlist', color: NEWS_FEED_COLORS.watchlist },
    ],
    items: emptyItems(),
    isExpanded: false,
    heightPercent: 8,
    autoScroll: true,
    selectedItemId: null,
    isDetached: false,
    intervalId: null,
  });
});

afterEach(() => {
  const state = useNewsStore.getState();
  if (state.intervalId) state.stopNewsFeed();
});

describe('useNewsStore', () => {
  it('starts with empty items per feed type', () => {
    const items = useNewsStore.getState().items;
    expect(items.global).toHaveLength(0);
    expect(items.trend).toHaveLength(0);
    expect(items['looking-at']).toHaveLength(0);
    expect(items.watchlist).toHaveLength(0);
  });

  it('startNewsFeed distributes items across feed types', () => {
    useNewsStore.getState().startNewsFeed();
    const items = useNewsStore.getState().items;
    // At least some feed should have items
    const totalItems = Object.values(items).flat().length;
    expect(totalItems).toBeGreaterThan(0);
    expect(useNewsStore.getState().intervalId).not.toBeNull();
  });

  it('stopNewsFeed clears interval', () => {
    useNewsStore.getState().startNewsFeed();
    useNewsStore.getState().stopNewsFeed();
    expect(useNewsStore.getState().intervalId).toBeNull();
  });

  it('startNewsFeed is idempotent', () => {
    useNewsStore.getState().startNewsFeed();
    const firstId = useNewsStore.getState().intervalId;
    useNewsStore.getState().startNewsFeed();
    expect(useNewsStore.getState().intervalId).toBe(firstId);
  });

  it('sets expanded state', () => {
    useNewsStore.getState().setExpanded(true);
    expect(useNewsStore.getState().isExpanded).toBe(true);
  });

  it('clamps height percent between 8 and 15', () => {
    useNewsStore.getState().setHeightPercent(5);
    expect(useNewsStore.getState().heightPercent).toBe(8);

    useNewsStore.getState().setHeightPercent(20);
    expect(useNewsStore.getState().heightPercent).toBe(15);

    useNewsStore.getState().setHeightPercent(12);
    expect(useNewsStore.getState().heightPercent).toBe(12);
  });

  it('toggles auto scroll', () => {
    expect(useNewsStore.getState().autoScroll).toBe(true);
    useNewsStore.getState().toggleAutoScroll();
    expect(useNewsStore.getState().autoScroll).toBe(false);
  });

  it('selects an item', () => {
    useNewsStore.getState().selectItem('item-1');
    expect(useNewsStore.getState().selectedItemId).toBe('item-1');
  });

  it('adds a feed', () => {
    useNewsStore.getState().addFeed({ id: 'custom', type: 'global', label: 'Custom', color: '#000' });
    expect(useNewsStore.getState().feeds).toHaveLength(5);
  });

  it('removes a feed', () => {
    useNewsStore.getState().removeFeed('watchlist');
    expect(useNewsStore.getState().feeds).toHaveLength(3);
    expect(useNewsStore.getState().feeds.find((f) => f.id === 'watchlist')).toBeUndefined();
  });

  it('getAllItems returns flattened sorted items', () => {
    useNewsStore.getState().startNewsFeed();
    const allItems = useNewsStore.getState().getAllItems();
    expect(allItems.length).toBeGreaterThan(0);
    // Should be sorted by timestamp descending
    for (let i = 1; i < allItems.length; i++) {
      expect(allItems[i - 1].timestamp).toBeGreaterThanOrEqual(allItems[i].timestamp);
    }
  });

  it('has 4 default feeds', () => {
    expect(useNewsStore.getState().feeds).toHaveLength(4);
  });
});
