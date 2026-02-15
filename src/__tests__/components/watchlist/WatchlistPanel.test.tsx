import { render, screen, fireEvent } from '@testing-library/react';
import { WatchlistPanel } from '@/components/watchlist/WatchlistPanel';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useMarketStore } from '@/stores/useMarketStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import type { Ticker } from '@/data/types/market';
import { WATCHLIST_COLORS } from '@/data/constants/colors';

// Mock Radix scroll area
jest.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
    <div className={className} {...props}>{children}</div>
  ),
  Viewport: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Scrollbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Thumb: () => <div />,
  Corner: () => <div />,
}));

// Mock hooks that use window features
jest.mock('@/hooks/useDetachable', () => ({
  useDetachable: () => ({ detached: false, detach: jest.fn(), reattach: jest.fn() }),
}));

jest.mock('@/hooks/useBroadcastChannel', () => ({
  useBroadcastChannel: jest.fn(),
}));

const mockTickers = new Map<string, Ticker>();
mockTickers.set('MSFT', {
  symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', subSector: 'Software',
  price: 400, previousClose: 398, change: 2, changePercent: 0.5,
  volume: 25e6, avgVolume: 20e6, marketCap: 3.1e12, high52w: 450, low52w: 300,
  beta: 1.1, pe: 35, eps: 11.43, dividend: 2.72, dividendYield: 0.68,
});
mockTickers.set('AAPL', {
  symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', subSector: 'Hardware',
  price: 185, previousClose: 186, change: -1, changePercent: -0.54,
  volume: 40e6, avgVolume: 35e6, marketCap: 2.9e12, high52w: 200, low52w: 150,
  beta: 1.2, pe: 30, eps: 6.17, dividend: 0.96, dividendYield: 0.52,
});

beforeEach(() => {
  useWatchlistStore.setState({
    groups: [
      {
        id: 'default',
        name: 'Main Watchlist',
        color: WATCHLIST_COLORS[0],
        items: [
          { symbol: 'MSFT', type: 'ticker' as const, addedAt: Date.now(), subscribedToNews: false },
          { symbol: 'AAPL', type: 'ticker' as const, addedAt: Date.now(), subscribedToNews: false },
        ],
        createdAt: Date.now(),
        sortOrder: 0,
      },
      {
        id: 'tech',
        name: 'Tech Plays',
        color: WATCHLIST_COLORS[1],
        items: [{ symbol: 'MSFT', type: 'ticker' as const, addedAt: Date.now(), subscribedToNews: false }],
        createdAt: Date.now(),
        sortOrder: 1,
      },
    ],
    isOpen: true,
    activeGroupId: 'default',
    filterGroupId: null,
    searchQuery: '',
    isDetached: false,
    notificationPrefs: [],
    contactInfo: { emailAddress: '', phoneNumber: '' },
  });

  useMarketStore.setState({
    tickers: mockTickers,
    indices: [],
    selectedTicker: 'MSFT',
    isRunning: false,
  });

  useDetailsStore.setState({
    selectedSymbol: 'MSFT',
  });
});

describe('WatchlistPanel', () => {
  it('renders search input', () => {
    render(<WatchlistPanel />);
    // Placeholder is dynamic: "Search tickers..." by default
    expect(screen.getByPlaceholderText('Search tickers...')).toBeInTheDocument();
  });

  it('renders group names', () => {
    render(<WatchlistPanel />);
    // Group names appear in filter tabs and group section headers
    expect(screen.getAllByText('Main Watchlist').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tech Plays').length).toBeGreaterThanOrEqual(1);
  });

  it('renders ticker items in active group', () => {
    render(<WatchlistPanel />);
    expect(screen.getAllByText('MSFT').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('AAPL').length).toBeGreaterThanOrEqual(1);
  });

  it('renders Watchlists title', () => {
    render(<WatchlistPanel />);
    expect(screen.getByText('Watchlists')).toBeInTheDocument();
  });

  it('clicking a ticker updates details panel', () => {
    render(<WatchlistPanel />);
    // Find the AAPL button
    const aaplButtons = screen.getAllByText('AAPL');
    const aaplButton = aaplButtons[0].closest('button');
    if (aaplButton) fireEvent.click(aaplButton);
    expect(useDetailsStore.getState().selectedSymbol).toBe('AAPL');
  });

  it('shows filter tabs including All', () => {
    render(<WatchlistPanel />);
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('shows watchlist count in footer', () => {
    render(<WatchlistPanel />);
    // "2/10 watchlists | 3 items"
    expect(screen.getByText(/2\/10 watchlists/)).toBeInTheDocument();
  });
});
