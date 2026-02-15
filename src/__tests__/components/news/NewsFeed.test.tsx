import { render, screen } from '@testing-library/react';
import { NewsFeed } from '@/components/news/NewsFeed';
import { useNewsStore } from '@/stores/useNewsStore';
import { NEWS_FEED_COLORS } from '@/data/constants/colors';
import type { NewsItem, NewsFeedType, NewsFeedConfig } from '@/data/types/news';

// Mock hooks that use window features
jest.mock('@/hooks/useDetachable', () => ({
  useDetachable: () => ({ detached: false, detach: jest.fn(), reattach: jest.fn() }),
}));

jest.mock('@/hooks/useBroadcastChannel', () => ({
  useBroadcastChannel: jest.fn(),
}));

// Mock Radix tooltip
jest.mock('@radix-ui/react-tooltip', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Trigger: ({ children, ...props }: { children: React.ReactNode; asChild?: boolean }) => (
    <div {...props}>{children}</div>
  ),
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const DEFAULT_FEEDS: NewsFeedConfig[] = [
  { id: 'global', type: 'global', label: 'Global', color: NEWS_FEED_COLORS.global },
  { id: 'trend', type: 'trend', label: 'Trends', color: NEWS_FEED_COLORS.trend },
  { id: 'looking-at', type: 'looking-at', label: 'Looking At', color: NEWS_FEED_COLORS['looking-at'] },
  { id: 'watchlist', type: 'watchlist', label: 'Watchlist', color: NEWS_FEED_COLORS.watchlist },
];

function emptyItems(): Record<NewsFeedType, NewsItem[]> {
  return { global: [], trend: [], 'looking-at': [], watchlist: [] };
}

const createMockItem = (overrides: Partial<NewsItem> = {}): NewsItem => ({
  id: `test-${Math.random()}`,
  headline: 'Test headline',
  summary: 'Test summary',
  source: 'reuters',
  timestamp: Date.now(),
  sentiment: 'neutral',
  tickers: ['MSFT'],
  sectors: ['Technology'],
  feedType: 'global',
  impact: 50,
  relevanceScore: 0.8,
  ...overrides,
});

beforeEach(() => {
  useNewsStore.setState({
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
  });
});

describe('NewsFeed', () => {
  it('renders feed column headers', () => {
    render(<NewsFeed />);
    expect(screen.getByText('Global')).toBeInTheDocument();
    expect(screen.getByText('Trends')).toBeInTheDocument();
    expect(screen.getByText('Looking At')).toBeInTheDocument();
    expect(screen.getByText('Watchlist')).toBeInTheDocument();
  });

  it('renders News Terminal toolbar label', () => {
    render(<NewsFeed />);
    expect(screen.getByText('News Terminal')).toBeInTheDocument();
  });

  it('renders news items in correct feed column', () => {
    const items = emptyItems();
    items.global = [
      createMockItem({ headline: 'Breaking: Market rallies', sentiment: 'positive', feedType: 'global' }),
      createMockItem({ headline: 'Fed holds rates steady', sentiment: 'neutral', feedType: 'global' }),
    ];
    useNewsStore.setState({ items });
    render(<NewsFeed />);
    // Headlines appear in both the row and the tooltip, so use getAllByText
    expect(screen.getAllByText('Breaking: Market rallies').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Fed holds rates steady').length).toBeGreaterThanOrEqual(1);
  });

  it('renders empty state when no items', () => {
    render(<NewsFeed />);
    // All 4 columns show "No news yet..."
    const emptyMessages = screen.getAllByText('No news yet...');
    expect(emptyMessages.length).toBe(4);
  });

  it('renders nothing when isDetached is true', () => {
    useNewsStore.setState({ isDetached: true });
    const { container } = render(<NewsFeed />);
    expect(container.firstChild).toBeNull();
  });

  it('shows AUTO button for auto-scroll toggle', () => {
    render(<NewsFeed />);
    expect(screen.getByText('AUTO')).toBeInTheDocument();
  });
});
