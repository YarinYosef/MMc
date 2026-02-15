import { render, screen, fireEvent } from '@testing-library/react';
import { CompassWidget } from '@/components/compass/CompassWidget';
import { useCompassStore } from '@/stores/useCompassStore';
import { COMPASS_CONFIGS, DEFAULT_COMPASS_ORDER } from '@/data/constants/compassConfig';
import type { CompassState } from '@/data/types/compass';

// Mock the UI Tooltip wrapper which re-exports from @radix-ui/react-tooltip
jest.mock('@/components/ui/Tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children, ...props }: { children: React.ReactNode; asChild?: boolean }) => (
    <div {...props}>{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock dnd-kit
jest.mock('@dnd-kit/sortable', () => ({
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

const mockConfig = COMPASS_CONFIGS[0]; // market-regime

const mockState: CompassState = {
  id: 'market-regime',
  signal: 'bullish',
  value: 45.3,
  confidence: 72,
  lastUpdated: Date.now(),
  details: { regime: 'Risk-On', trendStrength: 45, daysInRegime: 12 },
};

beforeEach(() => {
  useCompassStore.setState({
    compassStates: new Map(),
    barState: {
      order: [...DEFAULT_COMPASS_ORDER],
      expanded: null,
      hovered: null,
      hidden: new Set(),
      layerFilter: 'all',
    },
    intervalId: null,
  });
});

describe('CompassWidget', () => {
  it('renders without state (shows short name fallback)', () => {
    render(<CompassWidget config={mockConfig} state={null} />);
    expect(screen.getByText('Regime')).toBeInTheDocument();
  });

  it('renders with state', () => {
    render(<CompassWidget config={mockConfig} state={mockState} />);
    // Should have content (lazy loaded component or fallback)
    expect(document.body.textContent).toBeTruthy();
  });

  it('clicking expands the widget', () => {
    render(<CompassWidget config={mockConfig} state={mockState} />);
    // Find clickable element and click it
    const clickable = document.querySelector('[class*="cursor-pointer"]');
    if (clickable) fireEvent.click(clickable);
    expect(useCompassStore.getState().barState.expanded).toBe('market-regime');
  });

  it('clicking again collapses the widget', () => {
    useCompassStore.setState({
      barState: { ...useCompassStore.getState().barState, expanded: 'market-regime' },
    });
    render(<CompassWidget config={mockConfig} state={mockState} />);
    const clickable = document.querySelector('[class*="cursor-pointer"]');
    if (clickable) fireEvent.click(clickable);
    expect(useCompassStore.getState().barState.expanded).toBeNull();
  });
});
