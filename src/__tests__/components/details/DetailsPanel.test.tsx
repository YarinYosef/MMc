import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsPanel } from '@/components/details/DetailsPanel';
import { useDetailsStore, DEFAULT_SECTION_ORDER } from '@/stores/useDetailsStore';
import { useMarketStore } from '@/stores/useMarketStore';
import type { Ticker } from '@/data/types/market';

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

// Mock dnd-kit
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(() => ({})),
  useSensors: jest.fn(() => []),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  verticalListSortingStrategy: jest.fn(),
  sortableKeyboardCoordinates: jest.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: { Transform: { toString: () => undefined } },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Radix dialog for ChartModal
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Overlay: () => null,
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Title: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Close: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

// Mock the section sub-components to avoid recharts/d3 complexity
jest.mock('@/components/details/FundamentalsSection', () => ({
  FundamentalsSection: ({ symbol }: { symbol: string }) => <div data-testid="fundamentals-section">Fundamentals for {symbol}</div>,
}));
jest.mock('@/components/details/FinancialsSection', () => ({
  FinancialsSection: ({ symbol }: { symbol: string }) => <div data-testid="financials-section">Financials for {symbol}</div>,
}));
jest.mock('@/components/details/VolumeSection', () => ({
  VolumeSection: ({ symbol }: { symbol: string }) => <div data-testid="volume-section">Volume for {symbol}</div>,
}));
jest.mock('@/components/details/OptionsSection', () => ({
  OptionsSection: ({ symbol }: { symbol: string }) => <div data-testid="options-section">Options for {symbol}</div>,
}));
jest.mock('@/components/details/OrderBookSection', () => ({
  OrderBookSection: ({ symbol }: { symbol: string }) => <div data-testid="orderbook-section">OrderBook for {symbol}</div>,
}));
jest.mock('@/components/details/InsiderSection', () => ({
  InsiderSection: ({ symbol }: { symbol: string }) => <div data-testid="insider-section">Insider for {symbol}</div>,
}));
jest.mock('@/components/moneymap/guidance/NewsPriceReaction', () => ({
  NewsPriceReaction: () => <div data-testid="newsprice-section">NewsPriceReaction content</div>,
}));

const mockTicker: Ticker = {
  symbol: 'MSFT',
  name: 'Microsoft Corp',
  sector: 'Technology',
  subSector: 'Software',
  price: 400.50,
  previousClose: 398.00,
  change: 2.50,
  changePercent: 0.63,
  volume: 25_000_000,
  avgVolume: 20_000_000,
  marketCap: 3_100_000_000_000,
  high52w: 450,
  low52w: 300,
  beta: 1.1,
  pe: 35,
  eps: 11.43,
  dividend: 2.72,
  dividendYield: 0.68,
};

beforeEach(() => {
  useDetailsStore.setState({
    selectedSymbol: 'MSFT',
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    sectionStates: {
      fundamentals: { minimized: false },
      financials: { minimized: false },
      volume: { minimized: false },
      options: { minimized: false },
      orderbook: { minimized: false },
      insider: { minimized: false },
      newsprice: { minimized: false },
    },
    expandedChart: null,
  });

  const tickerMap = new Map<string, Ticker>();
  tickerMap.set('MSFT', mockTicker);
  useMarketStore.setState({
    tickers: tickerMap,
    indices: [],
    selectedTicker: 'MSFT',
    isRunning: false,
  });
});

describe('DetailsPanel', () => {
  it('renders ticker information', () => {
    render(<DetailsPanel />);
    expect(screen.getByText('MSFT')).toBeInTheDocument();
    expect(screen.getByText('Microsoft Corp')).toBeInTheDocument();
  });

  it('renders all 7 section headers', () => {
    render(<DetailsPanel />);
    expect(screen.getByText('Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Financials')).toBeInTheDocument();
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Options')).toBeInTheDocument();
    expect(screen.getByText('Order Book')).toBeInTheDocument();
    expect(screen.getByText('Insider')).toBeInTheDocument();
    expect(screen.getByText('News/Price')).toBeInTheDocument();
  });

  it('renders all section content when not minimized', () => {
    render(<DetailsPanel />);
    expect(screen.getByTestId('fundamentals-section')).toBeInTheDocument();
    expect(screen.getByTestId('financials-section')).toBeInTheDocument();
    expect(screen.getByTestId('volume-section')).toBeInTheDocument();
    expect(screen.getByTestId('options-section')).toBeInTheDocument();
    expect(screen.getByTestId('orderbook-section')).toBeInTheDocument();
    expect(screen.getByTestId('insider-section')).toBeInTheDocument();
    expect(screen.getByTestId('newsprice-section')).toBeInTheDocument();
  });

  it('clicking toggle button toggles minimized state', () => {
    render(<DetailsPanel />);
    // The toggle buttons have the chevron SVG. Find all toggle buttons
    // They have class "text-[#777777] hover:text-white"
    const toggleButtons = document.querySelectorAll('button.text-\\[\\#777777\\]');
    expect(toggleButtons.length).toBeGreaterThanOrEqual(7);
    // Click the first toggle (Fundamentals)
    fireEvent.click(toggleButtons[0]);
    expect(useDetailsStore.getState().sectionStates.fundamentals.minimized).toBe(true);
  });

  it('shows "Select a ticker" when no ticker is selected', () => {
    useDetailsStore.setState({ selectedSymbol: null });
    render(<DetailsPanel />);
    expect(screen.getByText('Select a ticker')).toBeInTheDocument();
  });

  it('shows price', () => {
    render(<DetailsPanel />);
    expect(screen.getByText('$400.50')).toBeInTheDocument();
  });
});
